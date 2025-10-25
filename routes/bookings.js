const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Listing = require("../models/listings");
const bookingController=require("../controllers/bookings.js");
const wrapAsync=require("../utils/wrapAsync.js");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Stripe Checkout Session
router.post("/:id/pay", wrapAsync(bookingController.createBooking));

// Render a simple payment page (GET) with a form that POSTs to the above route
router.get('/:id/pay', wrapAsync(bookingController.renderPaymentPage));

// Success and cancel pages for Stripe redirects
router.get('/success', wrapAsync(bookingController.renderSuccessPage));

router.get('/cancel', wrapAsync(bookingController.renderCancelPage));

module.exports = router;
