const mongoose = require('mongoose');
const { listingSchema } = require('../schema.js');
const reviewSchema = require('./review.js');
const Review = require('./review.js');
const Schema = mongoose.Schema;
const ListingSchema = new Schema({
  title: {
    type:String,
    required: true
  },
  description: String,
   image: {
    filename: { type: String, default: "listingimage" },
    url: {
      type: String,
      default: "https://www.shutterstock.com/image-photo/maldives-island-beach-tropical-landscape-600nw-2547983501.jpg"
    }
  },
  price: Number,
  location: String,
  country: String,
  // GeoJSON point for map integration { type: 'Point', coordinates: [lon, lat] }
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lon, lat]
      default: undefined
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
        ref: 'Review',
    },
    ],
});
ListingSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    });
  }
});
const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;