const express = require('express');
const router = express.Router();
const passport = require("passport")
const Poll = require("../models/poll");

router.get("/mypolls", isLoggedIn, (req, res) => {
    Poll.find({ author: req.user._id }, (err, docs) => {
        if (err) {
            return res.redirect("/");
        }
        res.render("users/my-polls", { polls: docs });
    })
    
})
           
router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    res.redirect("/");
})


router.use("/", notLoggedIn, (req, res, next) => next());

router.get("/signup", (req, res) => {
    let messages = req.flash("error")
    res.render("users/signup", { messages: messages })
});

router.post("/signup", passport.authenticate("local.signup", {
    successRedirect: "/",
    failureRedirect: "/users/signup",
    failureFlash: true
}));

router.get("/login", (req, res) => {
    let messages = req.flash("error")
    res.render("users/login", { messages: messages })
})

router.post("/login", passport.authenticate("local.login", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true 
}));

module.exports = router

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/users/login");
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }
    res.redirect("/");
}