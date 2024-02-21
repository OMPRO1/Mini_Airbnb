const express = require('express');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
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

    req.login(registeredUser,(err) => {
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to the wanderlust");
        res.redirect("/listings");
    });
    
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login" , saveRedirectUrl ,passport.authenticate('local', {failureRedirect :"/login" , failureFlash:true}) , async (req,res) => {
    req.flash("success", "welcome back to wanderlust");
    console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
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
