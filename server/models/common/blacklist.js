const mongoose=require("mongoose")

const blacklistSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    
},{timestamps:true})

const Blacklist=mongoose.model("Blacklist",blacklistSchema)
module.exports=Blacklist
