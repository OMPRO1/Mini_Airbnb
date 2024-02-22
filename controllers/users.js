const User = require("../models/user.js");

module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
  };

module.exports.signup = async (req,res) => {
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
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) => {
    req.flash("success", "welcome back to wanderlust");
    console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout =  (req,res,next) => {
    
    req.logOut((err) => {
        if(err){
            return next(err);
        }

        req.flash("success","Logged Out successfully");
        res.redirect("/listings");
    });

};