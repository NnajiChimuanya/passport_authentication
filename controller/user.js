const Router = require("express").Router()
const mongoose = require("mongoose")
const passport = require("passport")
const GitHubStrategy = require("passport-github")
const dotenv = require("dotenv")
const User = require("../model/user")
dotenv.config()







Router.get("/login", (req, res) => res.render("signup"))



//Router.get("/", (res, req) => res.send("Authenticated"))

Router.get('/auth/github', passport.authenticate("github"))

Router.get("/auth/github/callback", passport.authenticate("github", { failureRedirect : "/login"}), (req, res) => res.redirect("/ok"))



module.exports = Router 