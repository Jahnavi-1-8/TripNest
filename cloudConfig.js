const cloudinary = require('cloudinary').v2;

// Support common env var names. The project's .env currently uses
// CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET so we prefer those but
// fall back to alternate names if provided.
const cloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_KEY;
const cloudApiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_SECRET;

cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: cloudApiSecret,
});

// We export cloudinary instance only. Multer will write uploads to a local
// temp directory (handled in the routes) and controllers will upload the
// file to Cloudinary using cloudinary.uploader.upload(path).
module.exports = {
    cloudinary,
};