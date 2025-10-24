const express = require('express');
const app = express();
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const mongoose = require("mongoose");
const { validateReview , isLoggedIn,checkReviewAuthor} = require('../middleware');
const reviewController=require("../controllers/reviews.js");

// Debug middleware to trace incoming review requests
router.use((req, res, next) => {
	console.debug('Reviews router hit:', req.method, req.originalUrl, 'params:', req.params);
	next();
});

// If someone navigates to /listings/:id/reviews with GET, redirect to the listing page
router.get('/', (req, res) => {
	const { id } = req.params;
	return res.redirect(`/listings/${id}`);
});

//review route
router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//delete review route
router.delete("/:reviewId", isLoggedIn , checkReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports = router;