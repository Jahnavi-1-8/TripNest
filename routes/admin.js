const express = require('express');
const router = express.Router();
const adminController = require("../controllers/admin.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isAdmin } = require("../middleware.js");

// Admin view of all listings
router.get("/listings", isAdmin, wrapAsync(adminController.viewAllListings));

// Become host of a listing (Admin only)
router.get("/becomehost/:listingId", isAdmin, wrapAsync(adminController.adminBecomeHost));

module.exports = router;