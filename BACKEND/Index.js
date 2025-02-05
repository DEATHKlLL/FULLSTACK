require('dotenv').config()
const express = require("express")
const app = express()
const db = require("./DB/MySQL")
const route = require("./Routes/route")


app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }));
app.use("/",route)
app.listen(process.env.port)
