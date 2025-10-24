const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing = require('../models/listings');
main()
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/travelnest");
}
const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,owner:"68f7588fd942d7c21c517487"
    }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}
initDB();