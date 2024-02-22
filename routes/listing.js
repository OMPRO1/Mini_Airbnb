const express = require('express');
const app = express();
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema , reviewSchema} = require('../schema.js');
const Listing = require("../models/Listing.js");
const flash = require("connect-flash");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const {path} = require("path");
const listingController = require('../controllers/listing.js');
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({storage}); 

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));
;

router.get("/new" , isLoggedIn , listingController.renderNewForm); 

router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, validateListing,isOwner ,wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

router.get("/:id/edit" ,isLoggedIn, wrapAsync(listingController.renderEditForm));


module.exports = router;