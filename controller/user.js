const Router = require("express").Router()
const mongoose = require("mongoose")



mongoose.connect("mongodb://localhost:27017/passport_authentication", (err) => {
    if(err) throw err
    console.log("Connected to database succeffully")
})

Router.get("/auth", (req, res) => res.send("Authenticattionn"))

module.exports = Router