const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema , reviewSchema} = require('../schema.js');
const Review = require("../models/review.js");
const Listing = require("../models/Listing.js");
const {validateReview, isLoggedIn} = require("../middleware.js");

//Review section 

router.post("/",validateReview, wrapAsync(async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review added successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

// delete review route
router.delete("/:reviewId", wrapAsync( async (req,res) => {
    let {id,reviewId} = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}});
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
