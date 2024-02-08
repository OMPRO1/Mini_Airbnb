const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/Listing.js");
const path = require('path');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("Connection successful");
})
.catch((err) => { 
    console.log(err);
});

app.listen(3000, () => {
    console.log("Server running on port:3000");
});

app.get("/" ,(req,res) => {
    res.send("Working");
});

app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    //console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
});

app.get("/listings/new" , (req,res) => {
    res.render("./listings/new.ejs");
});

app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    res.render("./listings/show.ejs",{listing});
}); 
  
app.post("/listings", (req,res) =>{
    let data = req.body;
     console.log(data);
     res.redirect("/listings");
});

app.get("/listings/show" , (req,res) => {
    res.send("Working!");
});