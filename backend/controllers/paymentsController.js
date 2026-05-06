const pool   = require('../config/db');
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

const PLANS = {
  free: {
    id:          'free',
    name:        'Gratuito',
    price:       0,
    currency:    'usd',
    gameTiers:   1,   // access to tier 1 only (games 1-5)
    maxPatients: 1,
    features: [
      '5 juegos terapéuticos',
      'Seguimiento de logros básicos',
      'Sesiones ilimitadas',
      'Soporte de comunidad',
    ],
  },
  pro: {
    id:          'pro',
    name:        'Pro',
    price:       9.99,
    currency:    'usd',
    gameTiers:   3,   // tiers 1-3 (games 1-15)
    maxPatients: 10,
    stripePriceId: process.env.STRIPE_PRICE_PRO || null,
    features: [
      '15 juegos terapéuticos',
      'Todos los logros desbloqueables',
      'Reportes de progreso',
      'Hasta 10 pacientes',
      'Soporte por email',
    ],
  },
  premium: {
    id:          'premium',
    name:        'Clínica',
    price:       24.99,
    currency:    'usd',
    gameTiers:   5,   // all 5 tiers (games 1-24)
    maxPatients: null, // unlimited
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM || null,
    features: [
      'Los 24 juegos terapéuticos',
      'Análisis avanzados de progreso',
      'Pacientes ilimitados',
      'Exportación de reportes PDF',
      'Soporte prioritario 24/7',
    ],
  },
};

exports.getPlans = (req, res) => {
  res.json({ success: true, plans: Object.values(PLANS) });
};

exports.getSubscription = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT subscription_plan, subscription_status, subscription_expires_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const u    = rows[0];
    const plan = PLANS[u.subscription_plan] || PLANS.free;
    res.json({
      success: true,
      subscription: {
        plan:       u.subscription_plan,
        status:     u.subscription_status,
        expiresAt:  u.subscription_expires_at,
        planDetails: plan,
      },
    });
  } catch (err) { next(err); }
};

// ── Stripe Checkout (real payment) ──────────────────────────────────────────
exports.createCheckout = async (req, res, next) => {
  if (!stripe) {
    return res.status(503).json({
      success: false,
      message: 'Stripe no está configurado. Contacta al administrador.',
    });
  }
  try {
    const { plan } = req.body;
    if (!PLANS[plan] || plan === 'free') {
      return res.status(400).json({ success: false, message: 'Plan inválido para pago' });
    }

    const priceId = PLANS[plan].stripePriceId;
    if (!priceId) {
      return res.status(503).json({
        success: false,
        message: 'Precio de Stripe no configurado para este plan.',
      });
    }

    const [rows] = await pool.execute(
      'SELECT email, name, stripe_customer_id FROM users WHERE id = ?',
      [req.user.id]
    );
    const user = rows[0];

    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  user.name,
        metadata: { disslapp_user_id: String(req.user.id) },
      });
      customerId = customer.id;
      await pool.execute('UPDATE users SET stripe_customer_id = ? WHERE id = ?', [customerId, req.user.id]);
    }

    const session = await stripe.checkout.sessions.create({
      customer:            customerId,
      mode:                'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/precios?success=1&plan=${plan}`,
      cancel_url:  `${process.env.FRONTEND_URL}/precios?canceled=1`,
      metadata:    { disslapp_user_id: String(req.user.id), plan },
    });

    res.json({ success: true, url: session.url });
  } catch (err) { next(err); }
};

// ── Stripe Webhook ───────────────────────────────────────────────────────────
exports.webhook = async (req, res) => {
  if (!stripe) return res.json({ received: true });

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session      = event.data.object;
  const userId       = session?.metadata?.disslapp_user_id;
  const plan         = session?.metadata?.plan;
  const subscId      = session?.subscription;

  try {
    if (event.type === 'checkout.session.completed' && userId && plan) {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      await pool.execute(
        'UPDATE users SET subscription_plan=?, subscription_status=?, subscription_expires_at=?, stripe_subscription_id=? WHERE id=?',
        [plan, 'active', expires, subscId || null, userId]
      );
    }
    if (event.type === 'customer.subscription.deleted' && userId) {
      await pool.execute(
        'UPDATE users SET subscription_plan=\'free\', subscription_status=\'inactive\', stripe_subscription_id=NULL WHERE id=?',
        [userId]
      );
    }
  } catch (err) {
    console.error('Webhook DB error:', err);
  }

  res.json({ received: true });
};

// ── Demo / sandbox checkout (no Stripe keys needed) ─────────────────────────
exports.demoCheckout = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!['free', 'pro', 'premium'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan inválido' });
    }

    const expires = new Date();
    if (plan !== 'free') expires.setMonth(expires.getMonth() + 1);

    await pool.execute(
      'UPDATE users SET subscription_plan=?, subscription_status=?, subscription_expires_at=? WHERE id=?',
      [plan, 'active', plan === 'free' ? null : expires, req.user.id]
    );

    const [rows] = await pool.execute(
      'SELECT name, subscription_plan FROM users WHERE id=?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: plan === 'free' ? 'Cambiado a plan Gratuito' : `Plan ${PLANS[plan].name} activado`,
      user: {
        subscription_plan:   rows[0].subscription_plan,
        subscription_status: 'active',
      },
    });
  } catch (err) { next(err); }
};

// ── PayPal ────────────────────────────────────────────────────────────────────
const PAYPAL_BASE = (process.env.PAYPAL_ENV === 'live')
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPaypalToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret   = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error('PayPal no está configurado en el servidor');

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res  = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Error obteniendo token de PayPal');
  return data.access_token;
}

exports.createPaypalOrder = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const planData = PLANS[plan];
    if (!planData || planData.price === 0) {
      return res.status(400).json({ success: false, message: 'Plan inválido para pago' });
    }

    const token  = await getPaypalToken();
    const result = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount:      { currency_code: 'USD', value: planData.price.toFixed(2) },
          description: `Disslapp Plan ${planData.name} (1 mes)`,
          custom_id:   `${req.user.id}:${plan}`,
        }],
        application_context: { brand_name: 'Disslapp', shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' },
      }),
    });
    const order = await result.json();
    if (!order.id) return res.status(500).json({ success: false, message: 'Error creando orden PayPal' });
    res.json({ success: true, orderId: order.id });
  } catch (err) { next(err); }
};

exports.capturePaypalOrder = async (req, res, next) => {
  try {
    const { orderId, plan } = req.body;
    if (!orderId || !PLANS[plan]) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }

    const token   = await getPaypalToken();
    const result  = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const capture = await result.json();

    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'El pago PayPal no fue completado' });
    }

    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    await pool.execute(
      'UPDATE users SET subscription_plan=?, subscription_status=?, subscription_expires_at=? WHERE id=?',
      [plan, 'active', expires, req.user.id]
    );

    res.json({ success: true, message: `Plan ${PLANS[plan].name} activado` });
  } catch (err) { next(err); }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT stripe_subscription_id FROM users WHERE id=?',
      [req.user.id]
    );
    const subscId = rows[0]?.stripe_subscription_id;

    if (stripe && subscId) {
      await stripe.subscriptions.cancel(subscId);
    }

    await pool.execute(
      'UPDATE users SET subscription_plan=\'free\', subscription_status=\'inactive\', stripe_subscription_id=NULL, subscription_expires_at=NULL WHERE id=?',
      [req.user.id]
    );

    res.json({ success: true, message: 'Suscripción cancelada. Tu plan vuelve a Gratuito.' });
  } catch (err) { next(err); }
};
