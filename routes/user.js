const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require('../middleware');
const userController = require("../controllers/users.js");
const { authLimiter } = require('../utils/rateLimiters.js');
const { userSchema } = require('../schema.js');

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg);
        return res.redirect('/signup');
    } else {
        next();
    }
};

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(authLimiter, validateUser, wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLogInForm)
    .post(authLimiter, saveRedirectUrl, passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }), userController.logIn);

router.get("/logout", userController.logOut);
router.get("/profile", isLoggedIn, wrapAsync(userController.renderProfile));
router.get('/profile/edit', isLoggedIn, userController.renderEditForm);
router.put('/profile', isLoggedIn, wrapAsync(userController.updateProfile));

module.exports = router;