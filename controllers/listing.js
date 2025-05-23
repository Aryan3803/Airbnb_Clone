const Listing=require("../models/listing.js")

//***********************DASHBOARD ROUTE***********************//


module.exports.dashBoard=async (req,res)=>{
    res.render("listing/dashboard.ejs");
}



//***********************INDEX ROUTE***********************//


module.exports.index=async (req,res)=>{
    let owner = res.locals.currUser; 
    if (!owner) {
        res.redirect("/login");
    }
    
    const allListing = await Listing.find({ owner: owner._id });
    if (allListing.length === 0) {
        req.flash("error", "You have no listings. Please create a new one.");
        return res.redirect("/listings/new");
    }
    console.log(allListing); 
    res.render("listing/index.ejs", { allListing, showSearchBar: true  });
    
}


//***********************NEW ROUTE***********************//


module.exports.renderNewForm=(req,res)=>{
    res.render("listing/new.ejs",{showSearchBar: false});
}

//***********************SHOW ROUTE***********************//


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate: {path:"author" }}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing,showSearchBar: false});
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
        ],
        owner: req.user._id
    }).populate({path:"reviews",populate: {path:"author" }}).populate("owner");
    console.log(allListing);
    if(allListing.length===0){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }

    res.render("listing/search.ejs",{allListing,showSearchBar: true});
    // console.log(allListing);
}


//***********************POST OR CREATE ROUTE***********************//


module.exports.createListing=async (req,res)=>{
    console.log("Request Body:", req.body);
    let url=req.file.path;
    let filename=req.file.filename;
    let category = req.body.listing.category || []; 
    if (!Array.isArray(category)) {
        category = [category]; 
    }
    const newListing=new Listing(req.body.listing);
    newListing.category=category
    newListing.owner=req.user._id;  
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
}

//***********************EDIT ROUTE***********************//


module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs",{listing,originalImageUrl,showSearchBar: false});
}

//***********************UPDATE ROUTE***********************//


module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});   
    
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename; 
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

//***********************DELETE ROUTE***********************//


module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}
