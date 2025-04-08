if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose= require("mongoose");
const path=require("path");
const exp = require("constants");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js")
const flash=require("connect-flash");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const adminRouter=require("./routes/admin.js");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const passport=require("passport")
const LocalStrategy=require("passport-local");
const Admin=require("./models/admin.js");
const User=require("./models/user.js");



const dbURL=process.env.ATLASDB_URL

main().then(()=>{
    console.log("Connected to db");
    
}).catch(err=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbURL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter : 24*3600,
})

store.on("error",()=> {
    console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitalized:true,
    cookie:{
        expires:Date.now()+ 7* 24* 60 *60 *1000,
        maxAge:7* 24* 60 *60 *1000,
        httpOnly:true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.use("admin-local", new LocalStrategy(Admin.authenticate()));
passport.use("user-local", new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
  const type = user.role === "User" ? "User" : "Admin"; 
  done(null, { id: user._id, type });  // saves to session: { id: "xyz", type: "User" }
});

passport.deserializeUser(async (userData, done) => {
  try {
    if (userData.type === "Admin") {
      const admin = await Admin.findById(userData.id);
      return done(null, admin);
    } else {
      const user = await User.findById(userData.id);
      return done(null, user);
    }
  } catch (err) {
    done(err);
  }
});


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.currentPath = req.originalUrl;
    console.log(res.locals.currUser);
    next();
})

app.use("/",listingsRouter)
// app.use("/listings", listingsRouter);
app.use("/user/listings/:id/reviews",reviewsRouter)
app.use("/user",userRouter)
app.use("/",adminRouter)


app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page Not Found!"));
});


//***********************ERROR HANDLER (MIDDLE WARE)***********************//

app.use((err,req,res,next)=>{
    let {statusCode =500 ,message="Something Went Wrong!"} =err;
    res.status(statusCode).render("error.ejs",{message});    
})



app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})