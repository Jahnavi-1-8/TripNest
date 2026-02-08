const mongoose = require("mongoose");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const redisClient = require('../utils/redis');

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  // fallback to hidden form field if req.params is not set for some reason
  if (!id && req.body && req.body.listingId) id = req.body.listingId;
  // Debug: params may not be present if router isn't mounted correctly
  console.debug('createReview params:', req.params);
  if (!id) {
    req.flash('error', 'Listing id missing from request');
    return res.redirect('back');
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash('error', 'Invalid listing id');
    return res.redirect('back');
  }
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();

  listing.reviews.push(newReview);
  await listing.save();

  // Invalidate cache
  if (redisClient && redisClient.isOpen) {
    await redisClient.del(`listing:${id}`);
    console.log(`Redis Cache Invalidated: listing:${id}`);
  }

  req.flash('success', 'Successfully created a new Review!');
  res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async (req, res) => {
  // The parent router mounts this at /listings/:id/reviews, so the listing id
  // is available as req.params.id (not listingId). Use that name or alias it.
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  // Invalidate cache
  if (redisClient && redisClient.isOpen) {
    await redisClient.del(`listing:${id}`);
    console.log(`Redis Cache Invalidated: listing:${id}`);
  }

  req.flash('success', 'Successfully deleted the Review!');
  res.redirect(`/listings/${id}`);
};