const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router=express.Router();

const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js");
const adminController = require("../controllers/admin.js");


//********************  ACCOUNT TYPE  ********************//  

router.get("/accountType",adminController.accountType)

//********************  SIGN UP  ********************//  

router
    .route("/signup")
    .get(adminController.renderSignupForm)
    .post(wrapAsync(adminController.signup))

//********************  LOGIN  ********************//  

router
    .route("/login")
    .get(adminController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate('admin-local', { failureRedirect: '/login', failureFlash:true }) ,adminController.login)


//********************  LOGOUT  ********************//  

router.get("/logout",adminController.logout)

module.exports=router;