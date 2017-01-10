const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')

const schema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

schema.methods.encryptPassword = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

schema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", schema)