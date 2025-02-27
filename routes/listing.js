const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage })


//***********************INDEX ROUTE AND (POST OR CREATE) ROUTE***********************//

router
    .route("/")
    .get(wrapAsync(listingController.index)) // index
    .post(isLoggedIn, upload.single('listing[image]') ,validateListing ,wrapAsync(listingController.createListing)) // create
    
//***********************NEW ROUTE***********************//

router.get("/new",isLoggedIn,listingController.renderNewForm)

//***********************SHOW ROUTE AND UPDATE ROUTE AND DELETE ROUTE***********************//

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) // show
    .put( isLoggedIn,isOwner, upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing)) // update
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)) // delete

//***********************EDIT ROUTE***********************//

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports=router;