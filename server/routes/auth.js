const express=require('express')
const authRouter=express.Router()
const {userRegister,
    userLogin,
    userLogout,
    initiateOTP,
    userVerifyOTP,
    validateUser,
    validateLogin,
    changePassword,
    forgotPassword,
    updateResetPassword

}=require('../controllers/auth')

authRouter.post('/register',validateUser,userRegister)
authRouter.post('/login',validateLogin,userLogin)
authRouter.post('/logout',userLogout)
authRouter.post('/otp',initiateOTP)
authRouter.post('/verifyotp',userVerifyOTP)
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', updateResetPassword);
authRouter.post('/change-password', changePassword);


authRouter.get('/login',(req,res)=>{
    res.send("Hello")
})


module.exports=authRouter;