require('dotenv').config()
const express = require("express")
const cors = require("cors");
const route = require("./Routes/route")
const cookieParser = require('cookie-parser');
const { verifyToken } = require("./Utils/JWT")
const app = express()
app.set('trust proxy', 1);
app.set('view engine','ejs');
app.set('views', './public');
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static("./public"))
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use("/",route)

app.listen(process.env.port)
