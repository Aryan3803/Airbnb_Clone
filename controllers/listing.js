const Listing=require("../models/listing.js")


//***********************INDEX ROUTE***********************//


module.exports.index=async (req,res)=>{
    const allListing = await Listing.find({}); 
    res.render("listing/index.ejs",{allListing});
}


//***********************NEW ROUTE***********************//


module.exports.renderNewForm=(req,res)=>{
    res.render("listing/new.ejs");
}

//***********************SHOW ROUTE***********************//


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate: {path:"author" }}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
    console.log(listing);
}

//***********************POST OR CREATE ROUTE***********************//


module.exports.createListing=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
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
    res.render("listing/edit.ejs",{listing,originalImageUrl});
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
