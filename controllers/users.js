const User = require("../models/user");
const Review = require('../models/review');
const Listing = require('../models/listings');

module.exports.renderSignUpForm= (req, res) => {
    res.render("users/signup");
};
module.exports.signUp=async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to TripNest!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('signup');
    }
};
module.exports.renderLogInForm=(req, res) => {
    res.render("users/login");
};
module.exports.logIn=async (req, res) => {
    req.flash("success", "Welcome back to TravelNest");
    // Prefer res.locals.redirectUrl (set by middleware), fall back to session, else /listings
    const redirectUrl = (res && res.locals && res.locals.redirectUrl) || (req && req.session && req.session.redirectUrl) || "/listings";
    // Clean up session redirect if present
    if (req && req.session && req.session.redirectUrl) delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};
module.exports.logOut=(req, res, next) => {
        req.logout(function(err) {
                if (err) { return next(err); }
                req.flash("success", "Logged you out!");
                res.redirect("/listings");
            });
};
module.exports.renderProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            req.flash('error', 'You must be signed in to view your profile');
            return res.redirect('/login');
        }
        // Fetch reviews authored by this user
        const reviews = await Review.find({ author: req.user._id }).lean();

        // If there are reviews, resolve the listing title for each review by querying Listings
        let enrichedReviews = [];
        if (reviews.length > 0) {
            // Find listings that reference any of these reviews
            const reviewIds = reviews.map(r => r._id);
            const listings = await Listing.find({ reviews: { $in: reviewIds } }, { title: 1, reviews: 1 }).lean();
            // Build mapping from reviewId -> listing title
            const reviewToListing = {};
            for (const l of listings) {
                if (Array.isArray(l.reviews)) {
                    for (const rid of l.reviews) {
                        reviewToListing[String(rid)] = l.title;
                    }
                }
            }
            enrichedReviews = reviews.map(r => ({ ...r, listing: { title: reviewToListing[String(r._id)] || null } }));
        }

        // TODO: wire up a Booking model in future to load real trips; for now show empty trips
        const trips = [];
        res.render('users/profile', { user: req.user, trips, reviews: enrichedReviews });
    } catch (e) {
        next(e);
    }
};

module.exports.renderEditForm = (req, res) => {
    // Render the edit form with the current user values
    if (!req.user) {
        req.flash('error', 'You must be signed in to edit your profile');
        return res.redirect('/login');
    }
    res.render('users/edit', { user: req.user });
};

module.exports.updateProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            req.flash('error', 'You must be signed in to edit your profile');
            return res.redirect('/login');
        }
        const { username, email } = req.body;
        
        // Update user profile fields
        await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true, runValidators: true });
        
        req.flash('success', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (e) {
        next(e);
    }
};
