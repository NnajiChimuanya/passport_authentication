
const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const userRouter = require("./controller/user")
const passport = require("passport")
const session = require("express-session")


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



app.use("/", userRouter)


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  
    done(null, id);
  
});


app.listen(3000, () => console.log("App is listening at port now"))