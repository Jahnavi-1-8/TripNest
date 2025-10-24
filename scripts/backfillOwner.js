// Run this script from the project root with: node scripts/backfillOwner.js
// It will create (or find) a user with username 'demouser' and assign them as owner
// for any Listing documents that currently have no owner.

const mongoose = require('mongoose');
const User = require('../models/user');
const Listing = require('../models/listings');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/travelnest');
  console.log('Connected to MongoDB');
  try {
    let demo = await User.findOne({ username: 'demouser' });
    if (!demo) {
      console.log('Creating demouser...');
      demo = new User({ username: 'demouser', email: 'demo@example.com' });
      await User.register(demo, 'password');
      console.log('demouser created');
    } else {
      console.log('Found existing demouser');
    }
    const res = await Listing.updateMany({ $or: [{ owner: { $exists: false } }, { owner: null }] }, { $set: { owner: demo._id } });
    console.log(`Matched ${res.matchedCount}, Modified ${res.modifiedCount}`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

main();
