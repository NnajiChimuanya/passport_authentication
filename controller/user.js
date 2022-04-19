const Router = require("express").Router()
const mongoose = require("mongoose")
const passport = require("passport")
const GithubStrategy = require("passport-github")


mongoose.connect("mongodb://localhost:27017/passport_authentication", (err) => {
    if(err) throw err
    console.log("Connected to database succeffully")
})

Router.get("/auth", (req, res) => res.send("Authenticattionn"))





Router.get("/auth/github")

module.exports = Router