const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const app = express()
const userRouter = require("./controller/user")

app.set("view engine", "ejs")



app.get("/", (req, res) => res.render("signup"))
app.use("/user", userRouter)






app.listen(3000, () => console.log("App is listening at port now"))