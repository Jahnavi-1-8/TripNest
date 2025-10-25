const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require('../middleware');
const userController=require("../controllers/users.js");
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));

router.route("/login")
.get(userController.renderLogInForm)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}),userController.logIn);

router.get("/logout", userController.logOut);
router.get("/profile", isLoggedIn, wrapAsync(userController.renderProfile));
router.get('/profile/edit', isLoggedIn, userController.renderEditForm);
router.put('/profile', isLoggedIn, wrapAsync(userController.updateProfile));

module.exports = router;