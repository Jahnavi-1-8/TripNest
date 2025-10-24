const mongoose = require('mongoose');
const Listing = require('../models/listings');
const { data } = require('../init/data');

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/travelnest');
    console.log('Connected to MongoDB');

    let inserted = 0;
    for (const item of data) {
      // basic uniqueness check: title + location
      const exists = await Listing.findOne({ title: item.title, location: item.location });
      if (exists) continue;
      const doc = new Listing(item);
      await doc.save();
      inserted++;
    }

    console.log('Inserted:', inserted);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected');
  }
}

main();
