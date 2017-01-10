const mongoose = require("mongoose"); //CONTINUE HERE

const schema = new mongoose.Schema({
    question: { type: String, require: true },
    answers: [{
        answer: String,
        votes: Number
    }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
})

module.exports = mongoose.model("Poll", schema)