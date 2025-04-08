const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const Listing=require("../models/listing.js")
const Review=require("../models/review.js");
const flash=require("connect-flash");
const {validateReview, userLoggedIn,isReviewAuthor} =require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

//***********************POST REVIEW ROUTE***********************//
router.post("/",userLoggedIn, validateReview ,wrapAsync(reviewController.createReview));


//***********************DELETE REVIEW ROUTE***********************//
router.delete("/:reviewId",userLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;