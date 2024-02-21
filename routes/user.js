const express = require('express');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const router = express.Router();

router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req,res) => {
    try {
        let {email,username,password} = req.body;
    let newuser = new User({email,username});

    let registeredUser = await User.register(newuser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to the wanderlust");
    res.redirect("/listings");
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login" , passport.authenticate('local', {failureRedirect :"/login" , failureFlash:true}) , async (req,res) => {
    console.log(req.user);
    let a = 1;
    res.locals.user = a;
     res.redirect("/listings");
});

router.get("/logout" , (req,res,next) => {
    
    req.logOut((err) => {
        if(err){
            return next(err);
        }

        req.flash("success","Logged Out successfully");
        res.redirect("/listings");
    });

});

module.exports = router;
