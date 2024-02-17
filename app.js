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
const {listingSchema , reviewSchema} = require('./schema.js');
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

app.listen(8080, () => {
    console.log("Server running on port:8080");
});

app.get("/" ,(req,res) => {
    res.send("Working");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

//If a request comes on random route then error should be throwm
// app.all("*", (req,res,next) => {
//     throw new ExpressError(404,"Page not found!!");
// });
app.use((err,req,res,next) => {
    let {statusCode=500, message="Something Went Wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err});
} );