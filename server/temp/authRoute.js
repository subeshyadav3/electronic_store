const express = require('express')
const authRouter = express.Router()
var jwt = require('jsonwebtoken');
const User = require('../models/user')
const Token = require('../models/token')
const Blacklist=require("../models/blacklist");
const { checkAuth } = require('../middlewares/checkAuth');

authRouter.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body
        if (!email || !password || !name) return res.status(401).json({ message: "Enter Valid Details and All fields are required", status: "Failed" })


        //check if user exists or not 
        const userExist = await User.find({ email })
        if (userExist.length > 0) return res.status(401).json({ message: "User Already Exists", status: "Failed" })

        //create new user
        const user = new User({ email, password, name })
        const savedUser = await user.save()
        res.status(201).json({ message: "User Created Successfully", status: "Success", user: { email: savedUser.email, name: savedUser.name } })

    } catch (error) {
        res.status(500).json({ message: "Server Error", status: "Failed", error: error.message })
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
  
        if (!email || !password) return res.status(401).json({ message: "Enter Valid Details and All fields are required", status: "Failed" })
           
        //check if user exists or not
        const userExist = await User.findOne({ email })
        if (!userExist) return res.status(401).json({ message: "User Not Found", status: "Failed" })
           
        //check if password is correct
        const isMatch = await userExist.comparePassword(password)
        
        if (!isMatch) return res.status(401).json({ message: "Password Incorrect", status: "Failed" })
            
        //get the user
        const userToken = jwt.sign({
            userId: userExist._id, username: userExist.name
        }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.cookie('token', userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false, // false in dev (localhost)
            sameSite: 'none',
        });

        

        const refreshToken = jwt.sign({userId: userExist._id}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
       
        await saveRefreshTokenToDB(userExist._id, refreshToken);
        
        res.status(200).json({ message: "Login Success", status: "Success", token: userToken })

    } catch (error) {
        res.status(500).json({ message: "Server Error", status: "Failed", error: error.message })
    }
})


authRouter.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    try {
        // Ensure the refresh token is associated with the authenticated user (req.user)
        if (req.user) {
            // Blacklist the access token (if you are passing it in the request body, e.g. via a header or body)
            const accessToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
            console.log("AccessToken",accessToken)

           if(!accessToken) return res.status(401).json({ message: "Access token required" });

            
            // Remove refresh token from the database
            await removeRefreshTokenFromDB(refreshToken);

            // Blacklist the refresh token
            await Blacklist.create({ token: accessToken });

            res.status(200).json({ message: "Logout successful" });
        } else {
            return res.status(401).json({ message: "Unauthorized, user not authenticated" });
        }
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
});



//get new token 

authRouter.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if the token exists in the database
        const isValid = await isRefreshTokenValid(decoded.id, refreshToken);
        if (!isValid) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate a new access token
        const user = { id: decoded.id, username: decoded.username }; // Fetch user info
        const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired refresh token", error: error.message });
    }
});





//functions to for refresh token
const saveRefreshTokenToDB = async (userId, refreshToken) => {
    try {
        // Save the refresh token to the database
        const token = new Token({ token: refreshToken, user: userId })
        await token.save()
    } catch (error) {
        throw new Error(error.message);

    }
}

const removeRefreshTokenFromDB = async (refreshToken) => {
    try {
        // Remove the refresh token from the database
        await Token.findOneAndDelete({ token: refreshToken });
    }
    catch (error) {
        throw new Error(error.message);
    }
}

const isRefreshTokenValid = async (userId, refreshToken) => {
    try {
        // Check if the refresh token exists in the database
        const token = await Token.findOne({ token: refreshToken, user: userId });
        return !!token;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = authRouter;