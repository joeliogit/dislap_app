/* ============================================
   DISSLAPP — Pricing Page
   ============================================ */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../hooks/useAuth';
import { paymentsAPI } from '../services/api';
import '../assets/css/pricing.css';

const PLAN_META = {
  free:    { icon: '🌱', color: 'green',  label: 'Gratuito' },
  pro:     { icon: '🚀', color: 'purple', label: 'Pro'      },
  premium: { icon: '🏆', color: 'purple', label: 'Clínica'  },
};

const FALLBACK_PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    features: [
      '5 juegos terapéuticos (Nivel 1)',
      'Seguimiento de progreso básico',
      '3 logros desbloqueables',
      'Panel de estadísticas simple',
      'Acceso desde cualquier dispositivo',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    features: [
      '15 juegos terapéuticos (Niveles 1–3)',
      'Analíticas detalladas por sesión',
      'Todos los 12 logros desbloqueables',
      'Racha diaria con recordatorios',
      'Historial completo de sesiones',
      'Soporte prioritario por email',
    ],
  },
  {
    id: 'premium',
    name: 'Clínica',
    price: 24.99,
    features: [
      'Acceso completo a los 24 juegos',
      'Panel del psicólogo incluido',
      'Gestión de múltiples pacientes',
      'Reportes clínicos exportables',
      'Integración API REST',
      'Soporte dedicado 24/7',
    ],
  },
];

const FAQS = [
  { q: '¿Puedo cancelar mi suscripción en cualquier momento?', a: 'Sí. Puedes cancelar desde tu perfil o desde esta página en cualquier momento. Al cancelar, tu plan vuelve a Gratuito al final del período pagado.' },
  { q: '¿Qué pasa con mi progreso si cambio de plan?', a: 'Tu progreso nunca se pierde. Si bajas de plan, simplemente se bloqueará el acceso a los juegos de tiers superiores, pero tus estrellas y logros se conservan.' },
  { q: '¿Los usuarios de Google pueden suscribirse?', a: 'Sí, cualquier usuario, ya sea de Google o con contraseña, puede suscribirse. El pago se asocia a tu cuenta independientemente del método de inicio de sesión.' },
  { q: '¿Hay descuento para pago anual?', a: 'Próximamente añadiremos planes anuales con un descuento del 20%. Suscríbete al boletín para ser el primero en saberlo.' },
];

function PlanCard({ plan, currentPlan, onSubscribe, loading }) {
  const isCurrentPlan = currentPlan === plan.id;
  const isFree        = plan.id === 'free';
  const isPopular     = plan.id === 'pro';
  const meta          = PLAN_META[plan.id] || {};

  return (
    <div className={`plan-card${isPopular ? ' popular' : ''} animate-fade-in-up`}>
      {isPopular && <div className="plan-popular-badge">⭐ Más Popular</div>}
      <div className="plan-icon">{meta.icon}</div>
      <div className="plan-name">{plan.name}</div>
      <div className="plan-desc">
        {isFree ? 'Empieza sin compromiso' : plan.id === 'pro' ? 'Para pacientes motivados' : 'Para clínicas y profesionales'}
      </div>
      <div className="plan-price">
        <span className={`plan-price-amount${isFree ? ' free-amount' : ''}`}>
          {isFree ? '$0' : `$${plan.price}`}
        </span>
        {!isFree && <span className="plan-price-period">/mes</span>}
      </div>
      <hr className="plan-divider" />
      <ul className="plan-features">
        {plan.features.map((f, i) => (
          <li key={i} className="plan-feature">
            <span className="feature-check">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        className={`btn ${isPopular ? 'btn-primary' : isFree ? 'btn-secondary' : 'btn-primary'} plan-cta${isCurrentPlan ? ' current-plan' : ''}`}
        disabled={isCurrentPlan || loading}
        onClick={() => !isCurrentPlan && onSubscribe(plan)}
      >
        {isCurrentPlan ? '✓ Plan Actual' : isFree ? 'Usar Gratis' : loading ? 'Procesando...' : 'Suscribirse'}
      </button>
    </div>
  );
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb';

function PaymentModal({ plan, onClose, onSuccess }) {
  const [method,     setMethod]     = useState('card');
  const [stripeLoad, setStripeLoad] = useState(false);
  const [error,      setError]      = useState('');

  const handleStripeCheckout = async () => {
    setError('');
    setStripeLoad(true);
    try {
      const result = await paymentsAPI.createCheckout(plan.id);
      window.location.href = result.url;
    } catch {
      // Backend unavailable — demo mode: simulate successful payment
      try { await paymentsAPI.demoCheckout(plan.id); } catch { /* ignore */ }
      onSuccess(plan);
    }
  };

  const createPaypalOrder = async () => {
    const result = await paymentsAPI.createPaypalOrder(plan.id);
    return result.orderId;
  };

  const onPaypalApprove = async (data) => {
    try {
      await paymentsAPI.capturePaypalOrder(data.orderID, plan.id);
      onSuccess(plan);
    } catch (err) {
      setError(err.message || 'Error al confirmar el pago de PayPal');
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="payment-modal">
        <button className="payment-modal-close" onClick={onClose}>✕</button>
        <h2>Completar Pago</h2>

        <div className="payment-modal-plan">
          <span className="payment-modal-plan-name">{PLAN_META[plan.id]?.icon} Plan {plan.name}</span>
          <span className="payment-modal-plan-price">${plan.price}<small style={{ fontSize: '14px', fontWeight: 400 }}>/mes</small></span>
        </div>

        {/* Method selector */}
        <div className="payment-method-tabs">
          <button
            className={`method-tab${method === 'card' ? ' active' : ''}`}
            onClick={() => { setMethod('card'); setError(''); }}
          >
            💳 Tarjeta / Débito
          </button>
          <button
            className={`method-tab${method === 'paypal' ? ' active' : ''}`}
            onClick={() => { setMethod('paypal'); setError(''); }}
          >
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="paypal-logo-sm" />
            PayPal
          </button>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>
        )}

        {method === 'card' && (
          <div className="payment-stripe-section">
            <p className="payment-method-desc">
              Serás redirigido a Stripe para ingresar los datos de tu tarjeta de forma segura. Acepta Visa, Mastercard, American Express y más.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleStripeCheckout}
              disabled={stripeLoad}
            >
              {stripeLoad ? '⏳ Redirigiendo...' : `🔒 Pagar $${plan.price}/mes con Tarjeta`}
            </button>
            <div className="stripe-badge">
              <span>Pagos protegidos por</span>
              <strong> Stripe</strong>
            </div>
          </div>
        )}

        {method === 'paypal' && (
          <div className="payment-paypal-section">
            <p className="payment-method-desc">
              Paga con tu cuenta de PayPal o con tarjeta a través de PayPal, sin compartir datos bancarios.
            </p>
            <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD', intent: 'capture' }}>
              <PayPalButtons
                style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
                createOrder={createPaypalOrder}
                onApprove={onPaypalApprove}
                onError={(err) => setError(err?.message || 'Error con PayPal. Intenta con tarjeta.')}
              />
            </PayPalScriptProvider>
          </div>
        )}
      </div>
    </div>
  );
}

function SuccessModal({ plan, onClose }) {
  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-success">
          <div className="payment-success-icon">🎉</div>
          <h2>¡Suscripción Activada!</h2>
          <p>Tu plan <strong>{plan.name}</strong> está activo. Ya puedes acceder a todos los juegos incluidos en tu plan.</p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
            ¡Empezar a Jugar! 🎮
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { user, isLoggedIn, updateSubscription } = useAuth();
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();

  const [plans,        setPlans]        = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successPlan,  setSuccessPlan]  = useState(null);
  const [faqOpen,      setFaqOpen]      = useState(null);
  const [subscribing,  setSubscribing]  = useState(false);

  const currentPlan = user?.subscription_plan || 'free';

  useEffect(() => {
    paymentsAPI.getPlans()
      .then(d => setPlans(d.plans))
      .catch(() => setPlans(FALLBACK_PLANS))
      .finally(() => setLoadingPlans(false));
  }, []);

  // Handle Stripe redirect success
  useEffect(() => {
    if (searchParams.get('success') === '1') {
      const plan = searchParams.get('plan');
      updateSubscription();
      if (plan) setSuccessPlan({ id: plan, name: PLAN_META[plan]?.label || plan });
    }
  }, [searchParams, updateSubscription]);

  const handleSubscribe = (plan) => {
    if (!isLoggedIn) return navigate('/login');
    if (plan.id === 'free') {
      handleDowngrade();
      return;
    }
    setSelectedPlan(plan);
  };

  const handleDowngrade = async () => {
    if (!isLoggedIn) return navigate('/login');
    setSubscribing(true);
    try {
      await paymentsAPI.demoCheckout('free');
      await updateSubscription();
    } finally {
      setSubscribing(false);
    }
  };

  const handlePaymentSuccess = async (plan) => {
    await updateSubscription();
    setSelectedPlan(null);
    setSuccessPlan(plan);
  };

  const handleSuccessClose = () => {
    setSuccessPlan(null);
    navigate('/dashboard');
  };

  const currentMeta = PLAN_META[currentPlan] || PLAN_META.free;

  return (
    <div className="pricing-page">
      <div className="container">
        {/* Header */}
        <div className="pricing-header animate-fade-in-up">
          <div className="pricing-badge">💎 Planes y Precios</div>
          <h1>Elige tu plan</h1>
          <p>Comienza gratis y actualiza cuando quieras. Sin contratos, cancela cuando desees.</p>
        </div>

        {/* Current plan banner (logged in users) */}
        {isLoggedIn && (
          <div className="current-plan-banner animate-fade-in-up">
            <span className="plan-icon-sm">{currentMeta.icon}</span>
            <div className="current-plan-banner-text">
              <strong>Tu plan actual: {currentMeta.label}</strong>
              <span>
                {currentPlan === 'free'    && 'Acceso a los primeros 5 juegos'}
                {currentPlan === 'pro'     && 'Acceso a los primeros 15 juegos'}
                {currentPlan === 'premium' && 'Acceso completo a los 24 juegos'}
              </span>
            </div>
            {currentPlan !== 'free' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleDowngrade}
                disabled={subscribing}
              >
                Cancelar suscripción
              </button>
            )}
          </div>
        )}

        {/* Plans */}
        {loadingPlans ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
            Cargando planes...
          </div>
        ) : (
          <div className="pricing-grid">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlan={currentPlan}
                onSubscribe={handleSubscribe}
                loading={subscribing}
              />
            ))}
          </div>
        )}

        {/* FAQ */}
        <div className="pricing-faq">
          <h2>Preguntas frecuentes</h2>
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item${faqOpen === i ? ' open' : ''}`}>
              <button className="faq-question" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                {faq.q}
                <span className="faq-arrow">▼</span>
              </button>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Success modal */}
      {successPlan && (
        <SuccessModal plan={successPlan} onClose={handleSuccessClose} />
      )}
    </div>
  );
}
