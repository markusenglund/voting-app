const Poll = require("../models/poll");
const mongoose = require("mongoose");
mongoose.connect("mongodb://markus:markus@ds141358.mlab.com:41358/voting-app");

const polls = [
    new Poll({
        question: "What is your favorite airline?",
        answers: [{ answer: "Ryanair", votes: 10 }, { answer: "Wizzair", votes: 2 }, { answer: "Norwegian", votes: 3 }],
        author: "yogaboll"
    }),
    new Poll({
        question: "What is your favorite food?",
        answers: [{ answer: "Pizza", votes: 10 }, { answer: "9/11 WAS AN INSIDE JOB WAKE UP SHEEPLE JET FUEL CANT MELT STEEL BEAMS", votes: 2 }],
        author: "yogaboll"
    }),
    new Poll({
        question: "Vem vare som kasta?",
        answers: [{ answer: "Ingen", votes: 1 }, { answer: "Det var jag", votes: 2 }],
        author: "yogaboll"
    }),

]

var done = 0;
for (var i = 0; i < polls.length; i++) {
    polls[i].save(function(err, result) {
        done++;
        if (done === polls.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
