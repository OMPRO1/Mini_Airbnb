const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/Listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

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
  
app.post("/listings", async (req,res) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit" , async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    res.render("./listings/edit.ejs",{listing});
});

app.put("/listings/:id" , async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
});

app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});