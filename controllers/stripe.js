require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
const Listing = require('../models/listings');
const Booking = require('../models/booking');

const mongoose = require('mongoose');
const redisClient = require('../utils/redis');

// ... existing code ...

module.exports.webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    if (!webhookSecret) {
      event = req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const sessionData = event.data.object;

    // Start a MongoDB session for the transaction
    const session = await mongoose.startSession();

    // Retry logic wrapper
    const runTransactionWithRetry = async (txnFunc, session) => {
      const MAX_RETRIES = 3;
      let retries = 0;

      while (retries < MAX_RETRIES) {
        try {
          session.startTransaction();
          await txnFunc(session);
          await session.commitTransaction();
          console.log('Transaction committed successfully.');
          return; // Success
        } catch (error) {
          await session.abortTransaction();

          // Check if it's a transient error (like WriteConflict)
          if (error.errorLabels && error.errorLabels.includes('TransientTransactionError')) {
            console.log(`Transient transaction error encountered. Retrying (${retries + 1}/${MAX_RETRIES})...`);
            retries++;
            // Optional: Add a small backoff delay here if needed
            await new Promise(resolve => setTimeout(resolve, 50 * retries));
          } else {
            // Non-transient error, rethrow
            throw error;
          }
        }
      }
      throw new Error(`Transaction failed after ${MAX_RETRIES} retries due to transient errors.`);
    };

    try {
      await runTransactionWithRetry(async (session) => {
        const listingId = sessionData.metadata && sessionData.metadata.listingId;
        const userId = sessionData.metadata && sessionData.metadata.userId;
        const checkIn = sessionData.metadata && sessionData.metadata.checkIn ? new Date(sessionData.metadata.checkIn) : null;
        const checkOut = sessionData.metadata && sessionData.metadata.checkOut ? new Date(sessionData.metadata.checkOut) : null;
        const guests = sessionData.metadata && sessionData.metadata.guests ? Number(sessionData.metadata.guests) : 1;
        const totalAmount = sessionData.amount_total ? Number(sessionData.amount_total) / 100 : null;

        // 0. LOCK THE LISTING
        // We force a write to the Listing document to serialize transactions.
        // This is crucial for preventing Write Skew in snapshot isolation.
        await Listing.findByIdAndUpdate(
          listingId,
          { $inc: { __v: 1 } } // Increment version to force a write
        ).session(session);

        console.log(`Transactions serialized for listing ${listingId}`);

        // 1. Check for overlap INSIDE the transaction
        const existingBooking = await Booking.findOne({
          listing: listingId,
          $or: [
            { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
          ],
          paymentStatus: 'Paid'
        }).session(session);

        if (existingBooking) {
          // Logic conflict (Double Booking checks), NOT a database error.
          // We consciously throw an error to break out of the transaction wrapper, 
          // BUT this is a logical error, not a retryable one.
          const err = new Error(`Double booking prevented for listing ${listingId}`);
          err.name = 'DoubleBookingError';
          throw err;
        } else {
          // 2. Create booking
          const booking = new Booking({
            listing: listingId,
            user: userId || undefined,
            checkIn: checkIn || undefined,
            checkOut: checkOut || undefined,
            totalAmount: totalAmount || 0,
            paymentStatus: 'Paid'
          });

          await booking.save({ session });
          console.log('Booking operation buffered:', booking._id);
        }
      }, session);

      // Invalidate cache AFTER transaction commits
      const listingId = sessionData.metadata && sessionData.metadata.listingId;
      if (redisClient && redisClient.isOpen) {
        if (listingId) {
          await redisClient.del(`listing:${listingId}`);
          console.log(`Redis Cache Invalidated: listing:${listingId}`);
        }
      }

      // EMIT SOCKET EVENT for Real-time Availability
      if (req.io && listingId) {
        const checkIn = sessionData.metadata.checkIn;
        const checkOut = sessionData.metadata.checkOut;
        req.io.to(`listing:${listingId}`).emit('availabilityUpdated', {
          bookedDates: [{ start: checkIn, end: checkOut }]
        });
        console.log(`Socket event emitted: availabilityUpdated for listing:${listingId}`);
      }

    } catch (err) {
      if (err.name === 'DoubleBookingError') {
        console.error(err.message);
        // This is an expected "failure" (prevention), so we don't treat it as a system crash.
      } else {
        console.error('Failed to persist booking from webhook:', err);
      }
    } finally {
      session.endSession();
    }
  }

  res.json({ received: true });
};
