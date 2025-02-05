const express = require("express")
const router = express.Router()
const {RegisterUser,ListUser,LoginUser,VerifyUser} = require("../Controllers/account")

router.route("/register").post(RegisterUser)
router.route("/register/owner").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/token").post(VerifyUser)
router.route("/list").get(ListUser)

module.exports = router