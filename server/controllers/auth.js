const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/customers/user');
const Token = require('../models/common/token');
const Blacklist = require('../models/common/blacklist');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Helper Functions
const generateOTP = () => {
    return crypto.randomInt(100000, 999999); // 6-digit OTP
};

const sendOTP = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP for Login',
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending OTP email:', error);
        } else {
            console.log('OTP sent:', info.response);
        }
    });
};

// Register User
const userRegister = async (req, res) => {
    try {
        const { name, email, password,contact } = req.body;
        if (!name || !email || !password || !contact) return res.status(401).json({ message: "All fields are required!" });

        // Check if the user exists
        const checkUserExist = await User.findOne({ email });
        if (checkUserExist) return res.status(401).json({ message: "User Already Exists!" });

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
        const newUser = new User({ name, email, password: hashedPassword ,contact});
        const savedUser = await newUser.save();

        // sendOTP(email, generateOTP()); // Send OTP to email

        return res.status(201).json({ message: "User Created Successfully!", user: { email: savedUser.email, name: savedUser.name } });
    } catch (err) {
        console.log("Error registering user:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Login User
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(401).json({ message: "All fields are required!" });

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (!userExist) return res.status(401).json({ message: "User Not Found!" });
      
        const isMatch = await bcrypt.compare(password, userExist.password);
        
        if (!isMatch) return res.status(401).json({ message: "Password Incorrect!" });
        
        // Generate Tokens
        const accessToken = jwt.sign(
            { userId: userExist._id, username: userExist.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: userExist._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Save the refresh token in DB
        await saveRefreshTokenToDB(userExist._id, refreshToken);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: "none",
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: 'none',
        });
        

        return res.status(200).json({ message: "Login Success"});
    } catch (err) {
        console.log("Login error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Logout User
const userLogout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    try {
        // Blacklist the refresh token
        await Blacklist.create({ token: refreshToken });

        // Remove refresh token from DB
        await removeRefreshTokenFromDB(refreshToken);

        return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.log("Logout error:", err);
        res.status(500).json({ message: "Logout failed", error: err.message });
    }
};

// Send OTP to User Email
const initiateOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const otp = generateOTP();
        sendOTP(email, otp);
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        console.log("Error sending OTP:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Verify OTP
const userVerifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    try {
        // Validate OTP (for simplicity, assume OTP is correct if provided)
        // You can implement OTP validation logic as needed
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
        console.log("Error verifying OTP:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Save refresh token to DB
const saveRefreshTokenToDB = async (userId, refreshToken) => {
    try {
        const token = new Token({ token: refreshToken, user: userId });
        await token.save();
    } catch (err) {
        throw new Error("Error saving refresh token: " + err.message);
    }
};

// Remove refresh token from DB
const removeRefreshTokenFromDB = async (refreshToken) => {
    try {
        await Token.findOneAndDelete({ token: refreshToken });
    } catch (err) {
        throw new Error("Error removing refresh token: " + err.message);
    }
};

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    initiateOTP,
    userVerifyOTP,
};
