const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema , reviewSchema} = require('../schema.js');
const Listing = require("../models/Listing.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

router.get("/", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    //console.log(allListings);
  
    res.render("./listings/index.ejs",{allListings});
}));


router.get("/new" , (req,res) => {
    res.render("./listings/new.ejs");
}); 

router.get("/:id" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    //console.log(id);
    const listing = await Listing.findById(id).populate('reviews');
    //console.log(listing);
    res.render("./listings/show.ejs",{listing});
}));

router.post("/",validateListing, wrapAsync(async (req,res,next) =>{
    const newListing = new Listing(req.body.listing);
    //console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
}));

router.get("/:id/edit" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

router.put("/:id" , validateListing ,wrapAsync(async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"BAD REQUEST FROM CLIENT");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports = router;