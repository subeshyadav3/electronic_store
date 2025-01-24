const mongoose=require("mongoose")

const otpSchema=new mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{timestamps:true})

const OTP=mongoose.model("OTP",otpSchema)
module.exports=OTP