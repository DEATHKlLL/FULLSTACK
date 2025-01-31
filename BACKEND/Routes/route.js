const express = require("express")
const router = express.Router()
const login = require("../modals/login")

router.route("/login").post()
module.exports = router