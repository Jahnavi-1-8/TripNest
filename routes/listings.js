const express = require('express');
const app = express();
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}= require("../schema.js");
// const Listing = require("../models/listings.js");
// const mongoose = require("mongoose");
const {isLoggedIn} = require("../middleware.js");
const{checkListingAuthor, validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer = require("multer");
const path = require('path');
// store uploaded files temporarily in /uploads before uploading to Cloudinary
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', 'uploads'));
	},
	filename: function (req, file, cb) {
		// keep original name to make debugging easier
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });
//index and create
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.createListing))

//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);
//search route
router.get("/search", wrapAsync(listingController.searchListings));

// reserve route
router.get("/:id/reserve", isLoggedIn, listingController.renderReserveForm);
router.post("/:id/reserve", isLoggedIn, wrapAsync(listingController.processReserve));

//show,update and delete
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, checkListingAuthor, upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,checkListingAuthor, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn, checkListingAuthor, wrapAsync(listingController.editListing));


module.exports = router;