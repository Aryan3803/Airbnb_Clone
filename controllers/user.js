const User = require("../models/user.js")
const Listing=require("../models/listing.js")
//********************  SIGN UP  ********************//  


module.exports.renderSignupForm=(req,res)=>{
    res.render("guest/usersignup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to HotelHive");
            res.redirect("/user/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signup");
    }
}


//********************  LOGIN  ********************//  


module.exports.renderLoginForm=(req,res)=>{
    res.render("guest/userlogin.ejs",{showSearchBar: false});
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Hotelhive");
    let redirectUrl = req.session.redirectUrl || "/user/listings";
    delete req.session.redirectUrl; 
    res.redirect(redirectUrl);
};



//********************  LOGOUT  ********************//  


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged out!")
        res.redirect("/user/listings");
    })
}

//***********************INDEX ROUTE***********************//

module.exports.index=async (req,res)=>{
    const allListing = await Listing.find({});
    // console.log(allListing); 
    res.render("guest/index.ejs", { allListing, showSearchBar: true  });
    
}

//***********************SHOW ROUTE***********************//


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate: {path:"author" }}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/user/listings");
    }
    res.render("guest/show.ejs",{listing,showSearchBar: false});
    console.log(listing);
}

//***********************SEARCH AND CATEGORY ROUTE***********************//


module.exports.searchListing=async (req,res)=>{
    let query=req.query.query;
    query = query.replace(/-/g, " ");
    const allListing=await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } },
            { category: { $in: [query] } }
        ]
    }).populate({path:"reviews",populate: {path:"author" }}).populate("owner");
    console.log(allListing);
    if(allListing.length===0){
        req.flash("error","Listing does not exist!");
        res.redirect("/user/listings");
    }

    res.render("guest/search.ejs",{allListing,showSearchBar: true});
    // console.log(allListing);
}

