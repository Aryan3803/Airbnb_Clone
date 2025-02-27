const mongoose= require("mongoose");
const Listing=require("../models/listing.js")
const initData=require("./data.js");

const MONGO_URL="mongodb://127.0.0.1:27017/hotelhive";

main().then(()=>{
    console.log("Connected to db");
}).catch(err=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB =async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"67bdc5ba8bf31cf08d5698a2"}));
    await Listing.insertMany(initData.data);
    console.log("data was initailzed");
}

initDB();