const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../models/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    //console.log(allListings);
  
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm =  (req,res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req,res,next) => {
    let {id} = req.params;
    //console.log(id);
    let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: {path: "author"} })
    .populate("owner");    
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("./listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next) =>{

    let response =await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();

    console.log(response.body.features[0].geometry);
    res.send("done!");    
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    //console.log(newListing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename}
    await newListing.save();
   req.flash("success","New listing created successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250,e_blur:100");
    res.render("./listings/edit.ejs",{listing, orignalImageUrl } );
};

module.exports.updateListing = async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"BAD REQUEST FROM CLIENT");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body.listing);
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing is updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
};