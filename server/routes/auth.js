const express=require('express')
const authRouter=express.Router()
const {userRegister,userLogin,userLogout,initiateOTP,userVerifyOTP}=require('../../controllers/auth')

authRouter.post('/register',userRegister)
authRouter.post('/login',userLogin)
authRouter.post('/logout',userLogout)
authRouter.post('/otp',initiateOTP)
authRouter.post('/verifyotp',userVerifyOTP)

authRouter.get('/login',(req,res)=>{
    res.send("Hello")
})


module.exports=authRouter;