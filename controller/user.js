const Router = require("express").Router()
const mongoose = require("mongoose")
const passport = require("passport")
const GitHubStrategy = require("passport-github")
const dotenv = require("dotenv")
const User = require("../model/user")
const { resetWatchers } = require("nodemon/lib/monitor/watch")
dotenv.config()



//database connection
mongoose.connect("mongodb://localhost:27017/passport_authentication", (err) => {
    if(err) throw err
    console.log("Connected to database succeffully")
})


//setting up github strategy
passport.use(new GitHubStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
   console.log(profile)
   User.findOneAndUpdate({name : profile.displayName}, {name : profile.displayName, userId : profile.id},{upsert:true}, (err, user)=> {
       if(err) throw err
   })
   done(null, profile)
  }
));

const isAuthenticated = (req, res, next) => {
    if(req.user) {
      next()
    } else {
      res.redirect("login")
    }
}

Router.get("/", isAuthenticated, (req, res) => {
    console.log(req.user)
    User.findOne({userId : req.user }, (err, user) => {
        res.render("home", {user : user})
    })
    
  })
  
Router.get("/login", (req, res) => res.render("signup"))
  
Router.get('/auth/github', passport.authenticate("github"))
  
Router.get("/auth/github/callback", passport.authenticate("github", { failureRedirect : "/login"}), (req, res) => {
    res.redirect("/")
  })



module.exports = Router 