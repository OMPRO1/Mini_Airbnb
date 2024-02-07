const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/Listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("Connected");
})
.catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data added");
}

initDB()
.then(() => {
    console.log("data added successfully");
})
.catch((err) => {
    console.log(err);
});