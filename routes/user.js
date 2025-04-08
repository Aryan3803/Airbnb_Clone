const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router=express.Router();
const {userLoggedIn}=require("../middleware.js");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js");
const userController = require("../controllers/user.js");

//********************  SIGN UP  ********************//  

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))

//********************  LOGIN  ********************//  

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate('user-local', { failureRedirect: '/user/login', failureFlash:true }) ,userController.login)


//********************  LOGOUT  ********************//  

router.get("/logout",userController.logout)

module.exports=router;

//***********************INDEX ROUTE ROUTE***********************//

router
    .route("/listings")
    .get(userLoggedIn,wrapAsync(userController.index)) // index

//***********************SEARCH ROUTE***********************//

router.get("/listings/search",wrapAsync(userController.searchListing))

//***********************SHOW ROUTE***********************//

router
    .route("/listings/:id")
    .get(wrapAsync(userController.showListing)) // show

