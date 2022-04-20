
const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const userRouter = require("./controller/user")
const passport = require("passport")
const session = require("express-session")
const GitHubStrategy = require("passport-github")

app.set("view engine", "ejs")

app.use(session({
    secret: "muanya",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      httpOnly : true,
      secure: false
     }
}));

app.use(express.static("public/"))
app.use(passport.initialize())
app.use(passport.session())



//app.use("/", userRouter)

mongoose.connect("mongodb://localhost:27017/passport_authentication", (err) => {
    if(err) throw err
    console.log("Connected to database succeffully")
})

passport.use(new GitHubStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
   console.log(profile)
   done(null, profile)
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  
    done(null, id);
  
});

const isAuthenticated = (req, res, next) => {
  if(req.user) {
    next()
  } else {
    res.redirect("login")
  }
}

app.get("/", isAuthenticated, (req, res) => {
  console.log(req.user)
  res.render("home")
})

app.get("/login", (req, res) => res.render("signup"))

app.get('/auth/github', passport.authenticate("github"))

app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect : "/login"}), (req, res) => {
  res.redirect("/")
})







app.listen(3000, () => console.log("App is listening at port now"))