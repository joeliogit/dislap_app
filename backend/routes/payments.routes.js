const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/paymentsController');
const auth     = require('../middleware/auth');

// Public
router.get('/plans', ctrl.getPlans);

// Stripe raw body needed for webhook signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.webhook);

// Protected
router.get('/subscription',         auth, ctrl.getSubscription);
router.post('/checkout',            auth, ctrl.createCheckout);
router.post('/demo-checkout',       auth, ctrl.demoCheckout);
router.post('/cancel',              auth, ctrl.cancelSubscription);
router.post('/paypal/create-order', auth, ctrl.createPaypalOrder);
router.post('/paypal/capture-order',auth, ctrl.capturePaypalOrder);

module.exports = router;
