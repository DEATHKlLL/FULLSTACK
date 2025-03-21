const express = require("express")
const router = express.Router()
const {forgotpass,pglist,profile,usersearch,logout,index,RegisterUser,LoginUser,VerifyUser} = require("../Controllers/account")
const {verifyToken} = require("../Utils/JWT")

router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/auth").get((req,res)=>{res.sendFile("/public/auth/auth.html",{root:__dirname+"/../"})})
router.route("/token").post(VerifyUser).get((req,res)=>{res.sendFile("/public/token/token.html",{root:__dirname+"/../"})})
router.route("/").get(index)
router.route("/admin/user").get(usersearch)
router.route("/logout").get(logout)
router.route("/api/profile").get(profile)
router.route("/pg/register").post(pglist).get((req,res)=>{res.sendFile("/public/pg/register.html",{root:__dirname+"/../"})})
router.route("/forget").get(forgotpass)

module.exports = router