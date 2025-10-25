const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require('./models/listings');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  } 
  next();
};

module.exports.checkListingAuthor = async (req, res, next) => {
  const { id } = req.params;

  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }

  // Fetch the listing and populate owner
  const listing = await require('./models/listings').findById(id).populate('owner');

  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }

  // Admin bypasses owner check
  if (!req.user.isAdmin) {
    if (!listing.owner || String(listing.owner._id) !== String(req.user._id)) {
      req.flash('error', 'You do not have permission to do that');
      return res.redirect(`/listings/${id}`);
    }
  }

  // Passed checks
  req.listing = listing; // optional: attach listing to req for use in route
  next();
};


// ✅ Updated: Admin can bypass review author check
module.exports.checkReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash('error', 'Review not found');
    return res.redirect(`/listings/${id}`);
  }

  // Allow if author OR Admin
  if (!review.author || String(review.author) !== String(req.user._id)) {
    if (!req.user.isAdmin) {
      req.flash('error', 'You do not have permission to do that');
      return res.redirect(`/listings/${id}`);
    }
  }

  next();
};

module.exports.validateListing = (req, res, next) => {
  if (req.body && typeof req.body.latitude !== 'undefined') {
    if (req.body.latitude === '' || req.body.latitude === null) delete req.body.latitude;
    else req.body.latitude = Number(req.body.latitude);
  }
  if (req.body && typeof req.body.longitude !== 'undefined') {
    if (req.body.longitude === '' || req.body.longitude === null) delete req.body.longitude;
    else req.body.longitude = Number(req.body.longitude);
  }

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  console.debug('validateReview body:', req.body);
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    req.flash("error", "Access denied! Admin only.");
    return res.redirect("/listings");
  }
  next();
};
