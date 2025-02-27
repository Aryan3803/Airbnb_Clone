require('dotenv').config({ path: '../.env' });

const mongoose= require("mongoose");
const Listing=require("../models/listing.js")
const initData=require("./data.js");

const dbURL=process.env.ATLASDB_URL

main().then(()=>{
    console.log("Connected to db");
}).catch(err=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbURL);
}

const initDB =async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"67c072227bb2ce0a878763c8"}));
    await Listing.insertMany(initData.data);
    console.log("data was initailzed");
}

initDB();