const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js");
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
  const listing = await require('./models/listings').findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  if (!listing.owner || String(listing.owner) !== String(req.user._id)) {
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.checkReviewAuthor= async(req,res,next)=> {
  const { id,reviewId } = req.params;
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  const review = await require('./models/review').findById(reviewId);
  if (!review) {
    req.flash('error', 'Review not found');
    return res.redirect('/review');
  }
  if (!review.author || String(review.author) !== String(req.user._id)) {
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
    // coerce latitude/longitude hidden fields into numbers if present
    if (req.body && typeof req.body.latitude !== 'undefined') {
      if (req.body.latitude === '' || req.body.latitude === null) {
        delete req.body.latitude;
      } else {
        const lv = Number(req.body.latitude);
        if (!Number.isFinite(lv)) delete req.body.latitude; else req.body.latitude = lv;
      }
    }
    if (req.body && typeof req.body.longitude !== 'undefined') {
      if (req.body.longitude === '' || req.body.longitude === null) {
        delete req.body.longitude;
      } else {
        const lv = Number(req.body.longitude);
        if (!Number.isFinite(lv)) delete req.body.longitude; else req.body.longitude = lv;
      }
    }
    let {error}=listingSchema.validate(req.body);
   if(error){
    let msg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(msg,400);
   }
   else{
    next();
   }
   }
module.exports.validateReview = (req, res, next) => {
  // debug: show request body for review validation
  console.debug('validateReview body:', req.body);
    let {error}=reviewSchema.validate(req.body);
   if(error){
    let msg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(msg,400);
   }
   else{
    next();
   }
   }