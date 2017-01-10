const express = require('express');
const router = express.Router();
const Poll = require("../models/poll");

router.get('/create', isLoggedIn, (req, res) => {
    res.render('create')
})

router.post('/create', isLoggedIn, (req, res) => { 
    console.log("DEV MESSAGE: req.body: ")
    console.log(req.body)
    let answers = req.body.options
        .filter( val => val)
        .map( val => {
            return {answer: val, votes: 0}
        })
    const poll = new Poll({
        question: req.body.question,
        answers: answers,
        author: req.user //Obv has to change to whomever is logged in
    })
    poll.save((err, result) => {
        if (err) {
            return res.redirect("/");
        }
        console.log("!!DEV: result: ")
        console.log(result)
        res.redirect("/polls/"+result._id)
    })

})

router.get("/:id/options/:optionId", (req, res) => { 
    const pollId = req.params.id;
    const optionId = req.params.optionId;
    if (!req.session.hasVoted) {//Might wanna use session to prevent accessing this page again.
        req.session.hasVoted = []
    }
    
    Poll.update(
        { _id: pollId, 'answers._id': optionId },
        { '$inc': { 'answers.$.votes': 1 }},
        (err, poll) => {
            if (err) {
                return res.redirect("/");
            }
            req.session.hasVoted.push(pollId) 
            res.redirect("/polls/"+pollId)

    })
})

router.get('/:id/delete', isLoggedIn, (req, res) => {
    Poll.findById(req.params.id, (err, doc) => {
        if (err) {
            return res.redirect("/");
        }        
        if (req.user._id.toString() == doc.author.toString()) {
            doc.remove((err, result) => {
                if (err) {
                    return res.redirect("/");
                }                
                res.redirect('/users/mypolls')
            })
        } else {
            res.redirect('/polls/'+req.params.id)
        }  
    })
})

router.get('/:id', function(req, res, next) {
    if (!req.session.hasVoted) { //This could probably be more slick
        req.session.hasVoted = []
    }

    Poll.findById(req.params.id, (err, poll) => {
        if (err) {
            return res.redirect("/")
        }
        if (req.session.hasVoted.includes(req.params.id)) {
            const answers = JSON.stringify(poll.answers)
            res.render('poll-result', { poll: poll, answers: answers })
        } else {
            res.render('poll', { poll: poll });
        }            
    })

});

router.post('/:id', isLoggedIn, (req, res) => {
    const pollId = req.params.id
    Poll.update(
        { _id: pollId },
        { $push: { answers: {
            answer: req.body.option,
            votes: 1
        }}},
        (err, result) => {
            if (err) {
                return res.redirect("/");
            }
            req.session.hasVoted.push(pollId)
            res.redirect("/polls/"+pollId)
        }
    )
})
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/users/login");
}