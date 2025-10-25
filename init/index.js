require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const DB_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connected to MongoDB Atlas");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map(obj => ({
    ...obj,
    owner: "68f7588fd942d7c21c517487", // keep your owner ID
  }));

  await Listing.insertMany(initData.data);
  console.log("🌱 Database seeded successfully!");
};

main()
  .then(() => initDB())
  .then(() => mongoose.connection.close())
  .catch((err) => console.log("❌ Error:", err));
