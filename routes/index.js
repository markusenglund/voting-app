const express = require('express');
const router = express.Router();
const Poll = require("../models/poll");


router.get('/about', (req, res) => {
    res.render('about')
})
/* GET home page. */
router.get('/', function(req, res, next) {
    Poll.find( (err, polls) => {
        if (err) {
            return res.redirect("/");
        }
        res.render('index', { polls: polls });
    })

});

module.exports = router;
