const Listing = require("../models/listings.js");
const { isAdmin } = require("../middleware.js");

module.exports.viewAllListings =  async (req, res) => {
  const listings = await Listing.find().populate("owner");
  res.render("admin/listings", { listings });
};

module.exports.adminBecomeHost =async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return res.status(404).send("Listing not found");

    listing.owner = req.user._id; // make yourself host
    await listing.save();
    res.send({ message: "You are now host of this listing", listing });
  } catch (err) {
    res.status(500).send(err);
  }
};