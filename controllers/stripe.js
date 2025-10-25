require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
const Booking = require('../models/booking');

module.exports.webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    if (!webhookSecret) {
      // If no webhook secret, try to parse JSON normally (less secure) — but prefer configuring STRIPE_WEBHOOK_SECRET
      event = req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      // Use metadata that we attached when creating the session
      const listingId = session.metadata && session.metadata.listingId;
      const userId = session.metadata && session.metadata.userId;
      const checkIn = session.metadata && session.metadata.checkIn ? new Date(session.metadata.checkIn) : null;
      const checkOut = session.metadata && session.metadata.checkOut ? new Date(session.metadata.checkOut) : null;
      const guests = session.metadata && session.metadata.guests ? Number(session.metadata.guests) : 1;
      const totalAmount = session.amount_total ? Number(session.amount_total) / 100 : null;

      const booking = new Booking({
        listing: listingId,
        user: userId || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        totalAmount: totalAmount || 0,
        paymentStatus: 'Paid'
      });

      await booking.save();
      console.log('Booking persisted from webhook:', booking._id);
    } catch (err) {
      console.error('Failed to persist booking from webhook:', err);
      // don't fail the webhook; log and continue
    }
  }

  res.json({ received: true });
};
