const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : String,
    clientId : Number
}, {timestamps : true})

const User = mongoose.model("User", userSchema)

module.exports = User