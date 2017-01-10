const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser( (user, done) => {
    done(null, user.id);
});

passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})

passport.use("local.signup", new LocalStrategy({
    usernameField: "email", //What do these things actually affect?
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {
    req.checkBody("email", "Invalid email").isEmail(); //Is this the only place where usernameField matters?
    req.checkBody("password", "Password must be at least 4 characters.").isLength({min:4})
    let errors = req.validationErrors()
    if (errors) {
        let messages = []
        errors.forEach( (error) => {
            messages.push(error.msg);
        })
        return done(null, false, req.flash("error", messages))
    }
    User.findOne({ "email": email}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: "Email is already in use."})
        }
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save((err, result) => {
            if (err) {
                return done(err);
            }
            return done(null, newUser)
        })
    })
}))

passport.use('local.login', new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true    
}, (req, email, password, done) => {
    req.checkBody("email", "Invalid email").isEmail();
    req.checkBody("password", "Password must be at least 4 characters.").isLength({min:4})
    let errors = req.validationErrors()
    if (errors) {
        let messages = []
        errors.forEach( (error) => {
            messages.push(error.msg);
        })
        return done(null, false, req.flash("error", messages))
    }
    User.findOne({ "email": email}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            console.log("!!DEV: not a user")
            return done(null, false, {message: "Username not found"})
        }
        if(!user.isValidPassword(password)) {
            console.log("!!DEV: invalid password")
            return done(null, false, {message: "Invalid password"})
        }
        console.log("!!DEV: (valid password)")
        return done(null, user);
    })
}))
