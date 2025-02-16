const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/customers/user');
const Token = require('../models/common/token');
const Blacklist = require('../models/common/blacklist');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const OTP = require('../models/common/otp')

// Helper Functions
const generateOTP = () => crypto.randomInt(100000, 999999); // 6-digit OTP

const sendOTP = async (email, otp) => {
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

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent to:', email);
    } catch (error) {
        console.log('Error sending OTP email:', error);
    }
};

// Register User
const userRegister = async (req, res) => {
    const { name, email, password, contact, role = 'customer' } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        // const checkUserExist = await User.findOne({ email });
        // if (checkUserExist) return res.status(409).json({ message: "User Already Exists!", success: false });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, contact, role });
        const savedUser = await newUser.save();

        return res.status(201).json({ role: savedUser.role, message: "Account created successfully! Please login to continue.", success: true, user: { email: savedUser.email, name: savedUser.name } });
    } catch (err) {
        console.log("Error registering user:", err);
        res.status(500).json({ message: "There was an issue processing your request. Please try again later.", success: false });
    }
};

// Login User
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const userExist = await User.findOne({ email });
        if (!userExist) return res.status(403).json({ message: "Invalid Email or Password!", success: false });
        
        const isMatch = await bcrypt.compare(password, userExist.password);
        // console.log(isMatch)
        if (!isMatch) return res.status(403).json({ message: "Invalid Email or Password!", success: false });

        const accessToken = jwt.sign(
            { userId: userExist._id, name: userExist.name, email: userExist.email, role: userExist.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: userExist._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await saveRefreshTokenToDB(userExist._id, refreshToken);

        // Storing tokens in cookies
        res.cookie('token', accessToken, { httpOnly: true, secure: process.env.ISPROD, sameSite: process.env.ISPROD ? 'None' : 'Lax' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.ISPROD, sameSite: process.env.ISPROD ? 'None' : 'Lax' });


        // res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite:  'None' });
        // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite:  'None' });


        return res.status(200).json({
            message: "Login successful! Welcome back.",
            success: true,
            user: { email: userExist.email, name: userExist.name, role: userExist.role }
        });
    } catch (err) {
        console.log("Login error:", err);
        res.status(500).json({ message: "There was an issue processing your request. Please try again later.", success: false });
    }
};



//password reset
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const userExist = await User.findOne({ email });
        if (!userExist) return res.status(400).json({ message: "User not found" });
        console.log("here", String(email))
        await initiateOTP(email);

        return res.status(200).json({ success: true, message: "OTP sent successfully" });
    }
    catch (err) {
        console.log("Error sending OTP:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }


}

// updateResetPassword

const updateResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });

    try {
        const userExist = await User.findOne({ email });
        if (!userExist) return res.status(400).json({ message: "User not found" });

        const optVerify = await userVerifyOTP(email, otp);
        if (!optVerify) return res.status(400).json({ message: "Invalid OTP" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userExist.password = hashedPassword;
        await userExist.save();

        return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.log("Error updating password:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


//change password

const changePassword = async (req, res) => {
    const { prevPassword, newPassword } = req.body;
    if (!prevPassword || !newPassword) return res.status(400).json({ message: "All fields are required" });
    try {
        const token = req.cookies.token

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
        }
        //   console.log(req.user); //checking user --testing
        const userExist = await User.findOne({ email: req.user?.email });
        if (!userExist) return res.status(400).json({ message: "User not found" });
        const checkPassword = await bcrypt.compare(prevPassword, userExist.password);
        if (!checkPassword) return res.status(400).json({ message: "Incorrect Password" });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userExist.password = hashedPassword;
        await userExist.save();
        return res.status(200).json({ success: true, message: "Password Changed Successfully" });
    }
    catch (err) {
        console.log("Error changing password:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }

}
const getrefreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token missing" });

    const storedToken = await Token.findOne({ token: refreshToken });
    if (!storedToken) return res.status(403).json({ success: false, message: "Refresh token invalid or expired" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid refresh token" });

        const newAccessToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", newAccessToken, { httpOnly: true, secure: process.env.ISPROD, sameSite: process.env.ISPROD ? 'None' : 'Lax' });

        // res.cookie('token',newAccessToken, { httpOnly: true, secure: true, sameSite:  'Lax' });

        res.json({ success: true, accessToken: newAccessToken });
    });
};



const userLogout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    try {
        await Blacklist.create({ token: refreshToken });
        await removeRefreshTokenFromDB(refreshToken);
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (err) {
        console.log("Logout error:", err);
        res.status(500).json({ success: false, message: "Logout failed" });
    }
};

const initiateOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const otp = generateOTP();
        //add otp to db
        const newOTP = new OTP({ otp, email })
        await newOTP.save();

        sendOTP(email, otp);
        return res.status(200).json({ message: "OTP sent successfully", success: true });
    } catch (err) {
        console.log("Error sending OTP:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const userVerifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    try {
        const getOPTFromDB = await OTP.findOne({ email })
        if (!getOPTFromDB) return res.status(400).json({ message: "OTP not found" });
        if (getOPTFromDB.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        await OTP.findOneAndDelete({ email });
        return res.status(200).json({ message: "OTP verified successfully", success: true });
    } catch (err) {
        console.log("Error verifying OTP:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};


const saveRefreshTokenToDB = async (userId, refreshToken) => {
    try {
        await Token.create({ token: refreshToken, user: userId });
    } catch (err) {
        console.error("Error saving refresh token:", err);
    }
};

const removeRefreshTokenFromDB = async (refreshToken) => {
    try {
        await Token.findOneAndDelete({ token: refreshToken });
    } catch (err) {
        console.error("Error removing refresh token:", err);
    }
};



const validateUser = [
    body('email').isEmail().withMessage("Invalid email format"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body('name').notEmpty().withMessage("Name is required"),
    body('contact').isMobilePhone().withMessage("Invalid contact number"),
];


const validateLogin = [
    body('email').isEmail().withMessage("Invalid email format"),
    body('password').notEmpty().withMessage("Password is required"),
];

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    initiateOTP,
    getrefreshToken,
    userVerifyOTP,
    validateUser,
    validateLogin,
    changePassword,
    forgotPassword,
    updateResetPassword
};



