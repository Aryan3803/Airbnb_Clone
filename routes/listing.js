const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage })


//***********************DASHBOARD ROUTE***********************//

router.get("/",listingController.dashBoard)

//***********************INDEX ROUTE AND (POST OR CREATE) ROUTE***********************//

router
    .route("/listings")
    .get(isLoggedIn,wrapAsync(listingController.index)) // index
    .post(isLoggedIn, upload.single('listing[image]') ,validateListing ,wrapAsync(listingController.createListing)) // create
    
//***********************NEW ROUTE***********************//

router.get("/listings/new",isLoggedIn,listingController.renderNewForm)

//***********************SEARCH ROUTE***********************//

router.get("/listings/search",wrapAsync(listingController.searchListing))

//***********************SHOW ROUTE AND UPDATE ROUTE AND DELETE ROUTE***********************//

router
    .route("/listings/:id")
    .get(wrapAsync(listingController.showListing)) // show
    .put( isLoggedIn,isOwner, upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing)) // update
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)) // delete

//***********************EDIT ROUTE***********************//

router.get("/listings/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports=router;