const express=require('express')
const authRouter=express.Router()
const {checkAuth}=require('../middlewares/checkAuthCustomer')

const {userRegister,
    userLogin,
    userLogout,
    initiateOTP,
    userVerifyOTP,
    getrefreshToken,
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
authRouter.post('/refresh',getrefreshToken)
authRouter.post('/verifyotp',userVerifyOTP)
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', updateResetPassword);
authRouter.post('/change-password', changePassword);
authRouter.get('/verifyme',checkAuth,(req,res)=>{res.status(200).json({ success: true, user: req.user});})

authRouter.get('/login',(req,res)=>{
    res.send("Hello")
})


module.exports=authRouter;