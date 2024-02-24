const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/Listing.js");

const dbUrl = "mongodb+srv://ruturajstarapurkar:j4PRsrX0yDmw3pFM@cluster0.il2vodz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });
  
  async function main() {
    await mongoose.connect(dbUrl);
  }

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "65d9bfe331f1313f0c6ac904"}));
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