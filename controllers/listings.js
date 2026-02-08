const Listing = require("../models/listings");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const { cloudinary } = require('../cloudConfig.js');
const fs = require('fs');
const path = require('path');
const redisClient = require('../utils/redis');


// Index handler (list all listings) - ensure this is exported so routes can use it
module.exports.index = async (req, res, next) => {
  try {
    const { location, guests, checkin, checkout } = req.query || {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    // Define cache key based on query params to support basic filtering
    const isDefaultView = !location && !guests && !checkin && !checkout;

    // Cache Key Strategy:
    // - Default view: 'listings:all:p:1'
    // - Filtered view: 'listings:q:<base64-params>:p:1'
    let cacheKey = 'listings:all';
    if (!isDefaultView) {
      // Create a stable key from sorted query params
      const params = new URLSearchParams({ location: location || '', guests: guests || '', checkin: checkin || '', checkout: checkout || '' });
      params.sort();
      cacheKey = `listings:q:${Buffer.from(params.toString()).toString('base64')}`;
    }
    // Add page to cache key
    cacheKey += `:p:${page}`;

    if (redisClient && redisClient.isOpen) {
      const cachedListings = await redisClient.get(cacheKey);
      if (cachedListings) {
        console.log(`Redis Cache Hit: ${cacheKey}`);
        const result = typeof cachedListings === 'string' ? JSON.parse(cachedListings) : cachedListings;
        // Result stores both listings and metadata
        return res.render('listings/index', {
          allListings: result.listings,
          filters: { location: location || '', guests: guests || '', checkin: checkin || '', checkout: checkout || '' },
          currentPage: result.currentPage,
          totalPages: result.totalPages
        });
      }
    }

    let filters = {};
    if (location) {
      const regex = { $regex: location, $options: 'i' };
      // match location, country, title or description
      filters.$or = [
        { location: regex },
        { country: regex },
        { title: regex },
        { description: regex }
      ];
    }
    if (guests) filters.guests = { $gte: parseInt(guests, 10) };

    const totalListings = await Listing.countDocuments(filters);
    const totalPages = Math.ceil(totalListings / limit);

    const listings = await Listing.find(filters).skip(skip).limit(limit);

    if (redisClient && redisClient.isOpen) {
      // Store result structure with metadata
      const cacheValue = {
        listings,
        currentPage: page,
        totalPages
      };
      // TTL: 5 mins for search results
      await redisClient.set(cacheKey, JSON.stringify(cacheValue), { EX: 300 });
      console.log(`Redis Cache Miss: Set ${cacheKey} (TTL 300s)`);
    }

    // forward raw query values for pre-filling the search form
    const filterValues = { location: location || '', guests: guests || '', checkin: checkin || '', checkout: checkout || '' };
    return res.render('listings/index', {
      allListings: listings,
      filters: filterValues,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (err) {
    return next(err);
  }
};



module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};
module.exports.searchListings = async (req, res) => {
  // accept location, guests, checkin, checkout from query
  const { location, guests, checkin, checkout } = req.query;
  let filters = {};
  if (location) {
    const regex = { $regex: location, $options: 'i' };
    filters.$or = [
      { location: regex },
      { country: regex },
      { title: regex },
      { description: regex }
    ];
  }
  if (guests) filters.guests = { $gte: parseInt(guests, 10) };

  // NOTE: date-based availability requires a bookings model or unavailable dates on Listing.
  // For now we accept checkin/checkout and forward them to the view so the UI can show the selected dates.
  const listings = await Listing.find(filters);
  res.render("listings/searchResults", { listings, query: { location, guests, checkin, checkout } });
};
module.exports.renderReserveForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError('Page Not Found', 404));
    }
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }
    // Render the reserve page (views/listings/reserve.ejs)
    return res.render('listings/reserve', { listing, checkIn, checkOut, guests, currentUser: req.user });
  } catch (err) {
    return next(err);
  }
};
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError('Page Not Found', 404));
  }

  const cacheKey = `listing:${id}`;
  let listing;

  if (redisClient && redisClient.isOpen) {
    const cachedListing = await redisClient.get(cacheKey);
    if (cachedListing) {
      console.log(`Redis Cache Hit: ${cacheKey}`);
      listing = typeof cachedListing === 'string' ? JSON.parse(cachedListing) : cachedListing;
    }
  }

  if (!listing) {
    listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: "author" } }).populate('owner');
    if (listing) {
      if (redisClient && redisClient.isOpen) {
        await redisClient.set(cacheKey, JSON.stringify(listing), { EX: 3600 });
        console.log(`Redis Cache Miss: Set ${cacheKey}`);
      }
    }
  }

  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  let originalImage = listing.image.url;
  if (originalImage && originalImage.includes('/upload/')) {
    originalImage = originalImage.replace('/upload/', '/upload/w_400,h_300,c_fill/');
  }
  res.render("listings/show", { listing, originalImage });

};

module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body);
    if (req.user) newListing.owner = req.user._id;

    // If multer saved a file to disk, upload it to Cloudinary
    if (req.file) {
      // multer v2 file object may expose different properties on different platforms
      const candidatePaths = [];
      if (req.file.path) candidatePaths.push(req.file.path);
      if (req.file.destination && req.file.filename) candidatePaths.push(path.join(req.file.destination, req.file.filename));
      if (req.file.fieldname && req.file.originalname) candidatePaths.push(path.join(__dirname, '..', 'uploads', req.file.filename || req.file.originalname));
      // dedupe
      const filePaths = [...new Set(candidatePaths.filter(Boolean))];
      const filePath = filePaths.find(p => fs.existsSync(p));
      if (!filePath) {
        console.error('Uploaded file not found on disk. Candidate paths:', candidatePaths);
        req.flash('error', 'Uploaded image could not be processed. Please try uploading again.');
        return res.redirect('/listings/new');
      }
      let result;
      try {
        result = await cloudinary.uploader.upload(filePath, { folder: 'tripnest' });
      } catch (e) {
        // remove temp file then fail so the user notices upload didn't happen
        fs.unlink(filePath, (err) => {
          if (err) console.warn('Failed to delete temp file after upload failure', err);
        });
        console.error('Cloudinary upload failed:', e && e.message ? e.message : e);
        req.flash('error', 'Image upload failed. Please try again.');
        return res.redirect('/listings/new');
      }
      // on success
      try {
        newListing.image = {
          filename: result.public_id,
          url: result.secure_url
        };
        console.log('Cloudinary upload succeeded:', result.public_id);
      } finally {
        // remove local temp file
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('Failed to delete temp file', err);
        }
      }
    } else {
      // If the form requires an image, and multer didn't provide one,
      // let the user know instead of silently using default image.
      req.flash('error', 'Please upload an image for the listing.');
      return res.redirect('/listings/new');
    }

    // Prefer explicit latitude/longitude submitted by the map picker
    try {
      const lat = req.body.latitude ? parseFloat(req.body.latitude) : null;
      const lon = req.body.longitude ? parseFloat(req.body.longitude) : null;
      if (lat && lon) {
        newListing.geometry = { type: 'Point', coordinates: [lon, lat] };
      } else {
        // Geocode address (server-side) and save geometry if possible
        const address = ((newListing.location || '') + (newListing.country ? (', ' + newListing.country) : '')).trim();
        if (address) {
          const nomUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(address);
          const resp = await fetch(nomUrl);
          const places = await resp.json();
          if (Array.isArray(places) && places.length > 0) {
            const plat = parseFloat(places[0].lat);
            const plon = parseFloat(places[0].lon);
            newListing.geometry = { type: 'Point', coordinates: [plon, plat] };
          }
        }
      }
    } catch (err) {
      console.warn('Geocoding/coords failed on create:', err);
      // not fatal — listing can still be created without coords
    }

    await newListing.save();

    // Invalidate listings:all cache
    if (redisClient && redisClient.isOpen) {
      await redisClient.del('listings:all');
      console.log('Redis Cache Invalidated: listings:all');
    }

    req.flash('success', 'Successfully created a new listing!');
    res.redirect(`/listings/${newListing._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  // If previous middleware attached the listing (e.g. checkListingAuthor), reuse it
  const listing = req.listing || await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  // If we reached here and req.listing wasn't present, perform owner/admin check
  if (!req.listing) {
    if (!listing.owner || String(listing.owner) !== String(req.user._id)) {
      if (!req.user || !req.user.isAdmin) {
        req.flash('error', 'You do not have permission to edit this listing');
        return res.redirect(`/listings/${id}`);
      }
    }
  }
  const originalImage = listing && listing.image && listing.image.url ? listing.image.url : '';
  res.render("listings/edit", { listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  // If an image file is uploaded, upload it to Cloudinary and set image fields
  try {
    let updatedData = { ...req.body };
    if (req.file) {
      // find the actual path of the uploaded file
      const candidatePaths = [];
      if (req.file.path) candidatePaths.push(req.file.path);
      if (req.file.destination && req.file.filename) candidatePaths.push(path.join(req.file.destination, req.file.filename));
      const filePath = candidatePaths.find(p => fs.existsSync(p));
      if (!filePath) {
        req.flash('error', 'Uploaded image could not be processed. Please try again.');
        return res.redirect(`/listings/${id}/edit`);
      }
      let result;
      try {
        result = await cloudinary.uploader.upload(filePath, { folder: 'tripnest' });
        updatedData.image = { filename: result.public_id, url: result.secure_url };
        console.log('Cloudinary upload succeeded (update):', result.public_id);
      } catch (err) {
        console.error('Cloudinary upload failed during update:', err && err.message ? err.message : err);
        req.flash('error', 'Image upload failed. Please try again.');
        return res.redirect(`/listings/${id}/edit`);
      } finally {
        try { fs.unlinkSync(filePath); } catch (e) { console.warn('Failed to delete temp file', e); }
      }
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    // try to persist coordinates: prefer submitted lat/lon, otherwise geocode
    try {
      const lat = req.body.latitude ? parseFloat(req.body.latitude) : null;
      const lon = req.body.longitude ? parseFloat(req.body.longitude) : null;
      if (lat && lon) {
        updatedListing.geometry = { type: 'Point', coordinates: [lon, lat] };
        await updatedListing.save();
      } else {
        const loc = updatedData.location || updatedListing.location;
        const cty = updatedData.country || updatedListing.country;
        const address = ((loc || '') + (cty ? (', ' + cty) : '')).trim();
        if (address) {
          const nomUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(address);
          const resp = await fetch(nomUrl);
          const places = await resp.json();
          if (Array.isArray(places) && places.length > 0) {
            const plat = parseFloat(places[0].lat);
            const plon = parseFloat(places[0].lon);
            updatedListing.geometry = { type: 'Point', coordinates: [plon, plat] };
            await updatedListing.save();
          }
        }
      }
    } catch (err) {
      console.warn('Geocoding/coords failed on update:', err);
    }

    // Invalidate cache
    if (redisClient && redisClient.isOpen) {
      await redisClient.del('listings:all');
      await redisClient.del(`listing:${id}`);
      console.log(`Redis Cache Invalidated: listing:${id} and listings:all`);
    }

    req.flash('success', 'Successfully Updated a listing!');
    return res.redirect(`/listings/${updatedListing._id}`);
  } catch (e) {
    console.error('Error updating listing:', e);
    req.flash('error', 'Failed to update listing.');
    return res.redirect(`/listings/${id}/edit`);
  }
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return res.status(404).send("Listing not found");
  }

  // Invalidate cache
  if (redisClient && redisClient.isOpen) {
    await redisClient.del('listings:all');
    await redisClient.del(`listing:${id}`);
    console.log(`Redis Cache Invalidated: listing:${id} and listings:all`);
  }

  req.flash('success', 'Successfully Deleted a listing!');
  res.redirect("/listings");
};

// Handle reservation POST (placeholder - integrates with payment/booking flow later)
module.exports.processReserve = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError('Page Not Found', 404));
    }
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }
    // TODO: integrate payment gateway and Booking model. For now, acknowledge the reservation request.
    req.flash('success', `Reservation request received for ${listing.title}. Dates: ${checkIn || '—'} to ${checkOut || '—'} for ${guests || 1} guest(s).`);
    return res.redirect(`/listings/${id}`);
  } catch (err) {
    return next(err);
  }
};