const express = require('express');
const router = express.Router();
const expressRaw = express.raw;
const stripeController = require('../controllers/stripe');

// Stripe requires the raw body for signature verification. We apply raw middleware only to this route.
router.post('/webhook', expressRaw({ type: 'application/json' }), stripeController.webhookHandler);

module.exports = router;
