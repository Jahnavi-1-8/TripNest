const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: { type: Boolean, default: false }, // <-- Add this
    isHost: { type: Boolean, default: false },
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
