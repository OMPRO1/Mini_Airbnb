const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/Listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const listingSchema = require('./schema.js');


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

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next()
    }
}

app.listen(8080, () => {
    console.log("Server running on port:8080");
});

app.get("/" ,(req,res) => {
    res.send("Working");
});

app.get("/listings", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    //console.log(allListings);
  
    res.render("./listings/index.ejs",{allListings});
}));


app.get("/listings/new" , (req,res) => {
    res.render("./listings/new.ejs");
}); 

app.get("/listings/:id" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("./listings/show.ejs",{listing});
}));

app.post("/listings",validateListing, wrapAsync(async (req,res,next) =>{
    const newListing = new Listing(req.body.listing);
    //console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

app.put("/listings/:id" , validateListing ,wrapAsync(async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"BAD REQUEST FROM CLIENT");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//If a request comes on random route then error should be throwm
// app.all("*", (req,res,next) => {
//     throw new ExpressError(404,"Page not found!!");
// });
app.use((err,req,res,next) => {
    let {statusCode=500, message="Something Went Wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err});
} );