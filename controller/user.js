const Router = require("express").Router()
const mongoose = require("mongoose")
const passport = require("passport")
const GitHubStrategy = require("passport-github")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const TwitterStrategy = require("passport-twitter")
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
    clientID: process.env.Github_clientID,
    clientSecret: process.env.Github_clientSecret,
    callbackURL: process.env.Github_callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
   console.log(profile)

   User.findOne({clientID : profile.id}, async (err, user) => {
     if(err) throw err

     if(user !== null) {
       done(null, profile)
     } else {
        const newUser = await new User({
          name : profile.displayName,
          clientId : profile.id,
          image : profile.photos[0].value
        })
        newUser.save((err, user) => {
          if(err) throw err
        })
        done(null, profile)
     }
   })
  }
));

//setting up google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.Google_clientID,
  clientSecret: process.env.Google_clientSecret,
  callbackURL: process.env.Google_callbackURL
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile)
  User.findOne({clientId : profile.id}, (err, user) => {
    if(err) throw err
    if(user !== null) {
      done(null, profile)
    } else {
      const newUser = new User({
        name : profile.displayName,
        clientId : profile.id,
        image : profile.photos[0].value
      })
      newUser.save((err, user) => {
        if(err) throw err
        done(null, profile)
      })
    }
  })
}
));

//setting up twitter startegy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACKURL
},
function(token, tokenSecret, profile, done) {
  User.findOne({clientId : profile.id}, (err, user) => {
    if(err) throw err
    if(user !== null) {
      done(null, profile)
    } else {
      const newUser = new User({
        name : profile.displayName,
        clientId : profile.id,
        image : profile.photos[0].value
      })
      newUser.save((err, user) => {
        if(err) throw err
        done(null, profile)
      })
    }
  })
}
));


//Authorization
const isAuthenticated = (req, res, next) => {
    if(req.user) {
      next()
    } else {
      res.redirect("login")
    }
}

//Route for getting homepage if user is authenticated
Router.get("/", isAuthenticated, (req, res) => {
    console.log(req.user)
    User.findOne({clientID : req.user}, (err, user) => {
      if(err) throw err
      res.render("home", {user : user})
    })
    
   
})
  
Router.get("/login", (req, res) => res.render("signup"))
  
Router.get('/auth/github', passport.authenticate("github"))
  
Router.get("/auth/github/callback", passport.authenticate("github", { failureRedirect : "/login"}), (req, res) => {
    res.redirect("/")
})

Router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

Router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

Router.get('/auth/twitter', passport.authenticate('twitter'));

Router.get('/auth/twitter/callback', 
passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

Router.get("/logout", (req, res) => {
  req.logOut()
  res.redirect("/login")
})



module.exports = Router 