const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Listing = require("../models/listings");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Stripe Checkout Session
router.post("/:id/pay", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const { checkIn, checkOut, guests } = req.body;

    // Calculate nights between checkIn and checkOut. Default to 1 night when dates missing/invalid
    let nights = 1;
    try {
      if (checkIn && checkOut) {
        const ci = new Date(checkIn);
        const co = new Date(checkOut);
        const msPerDay = 24 * 60 * 60 * 1000;
        const diff = Math.round((co - ci) / msPerDay);
        if (!isNaN(diff) && diff > 0) nights = diff;
      }
    } catch (e) {
      nights = 1;
    }

    const pricePerNight = Number(listing.price) || 0;
    const subtotal = Number((pricePerNight * nights).toFixed(2));
    // Example policy: 10% long-stay discount for 7+ nights
    const discount = nights >= 7 ? Number((subtotal * 0.10).toFixed(2)) : 0;
    // Taxes: 5% of (subtotal - discount)
    const taxes = Number(((subtotal - discount) * 0.05).toFixed(2));
    const totalPrice = Number((subtotal - discount + taxes).toFixed(2));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
                currency: "inr",
                product_data: {
                  name: listing.title,
                  description: `${nights} night(s) — ${guests || 1} guest(s)`
                },
                unit_amount: Math.round(totalPrice * 100),
              },
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/bookings/success`,
      cancel_url: `${process.env.BASE_URL}/bookings/cancel`,
    });

    res.redirect(session.url);
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

// Render a simple payment page (GET) with a form that POSTs to the above route
router.get('/:id/pay', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).send('Listing not found');
    // Render a lightweight payment page that submits to POST /:id/pay
    res.render('bookings/pay', { listing });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Success and cancel pages for Stripe redirects
router.get('/success', (req, res) => {
  res.render('bookings/success');
});

router.get('/cancel', (req, res) => {
  res.render('bookings/cancel');
});

module.exports = router;
