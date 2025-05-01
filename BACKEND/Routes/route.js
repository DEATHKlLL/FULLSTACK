const express = require("express")
const router = express.Router()
const {forgotpass,profile,usersearch,logout,index,RegisterUser,LoginUser,VerifyUser} = require("../Controllers/account")
const {verifyToken} = require("../Utils/JWT")
const {pglist,PGSearch,PgSlotListByOwner,PGApprovalist,PGApprovalUpdate,PgSlotBook,PgSlotBookview} = require('../Controllers/PG')
const rateLimit = require('express-rate-limit');
const multerHandler = require('../Middleware/multerwrapper');
const {upload}= require('../Utils/multer')

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: { error: 'Too many login attempts. Please try again later(15m).' },
    headers: true, // Send rate limit headers
});

router.route("/register").post(RegisterUser)
router.route("/login").post(loginLimiter,LoginUser)
router.route("/auth").get((req,res)=>{res.sendFile("/public/auth/auth.html",{root:__dirname+"/../"})})
router.route("/token").post(VerifyUser).get((req,res)=>{res.sendFile("/public/token/token.html",{root:__dirname+"/../"})})
router.route("/").get(index)
router.route("/admin/user").get(usersearch)
router.route("/logout").get(logout)
router.route("/api/profile").get(profile)
router.route("/pg/register").post(multerHandler(upload.fields([{ name: 'pgImages', maxCount: 5 }])),pglist).get((req,res)=>{res.sendFile("/public/pg/register.html",{root:__dirname+"/../"})})
router.route("/pg/find").get(PGSearch)
.get((req,res)=>{res.sendFile("/public/pg/register.html",{root:__dirname+"/../"})})
router.route("/forget").get(forgotpass)
router.route("/pg/approval").get(PGApprovalist)
router.route("/admin/pg/update").get(PGApprovalUpdate)
router.route("/seeker/books").post(PgSlotBook).get((req,res)=>{res.sendFile("/public/Seeker/staybook.html",{root:__dirname+"/../"})})
router.route("/seeker/view").get(PgSlotBookview)
router.route("/owner/view").get(PgSlotListByOwner)

module.exports = router