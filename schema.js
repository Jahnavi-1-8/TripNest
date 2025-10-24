const Joi=require('joi');
const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    image: Joi.object({
        filename: Joi.string().allow(''),
        url: Joi.string().allow('')
    }).optional()
}).unknown(true);

const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required(),
    // optional hidden field submitted by the review form
    listingId: Joi.string().optional()
}).unknown(true); // allow extra top-level keys (hidden inputs etc.)

module.exports = { listingSchema, reviewSchema };