const User = require("../models/user");
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