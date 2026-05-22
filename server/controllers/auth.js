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

const generateResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    return { resetToken, hashedToken };
};

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

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
        // console.log('OTP sent to:', email);
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
        const checkUserExist = await User.findOne({ email });
        if (checkUserExist) return res.status(409).json({ message: "User Already Exists!", success: false });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, contact, role });
        const savedUser = await newUser.save();

        return res.status(201).json({ role: savedUser.role, message: "Account created successfully! Please login to continue.", success: true, user: { userId: savedUser._id, email: savedUser.email, name: savedUser.name, role: savedUser.role } });
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
            user: { userId: userExist._id, email: userExist.email, name: userExist.name, role: userExist.role }
        });
    } catch (err) {
        console.log("Login error:", err);
        res.status(500).json({ message: "There was an issue processing your request. Please try again later.", success: false });
    }
};



//password reset
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    try {
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { resetToken, hashedToken } = generateResetToken();

        userExist.resetPasswordToken = hashedToken;
        userExist.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
        await userExist.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset your password',
            text: `You requested a password reset. Use this link to continue: ${resetUrl}\n\nThis link expires in 15 minutes.`,
            html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 15 minutes.</p>`,
        });

        return res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message || "Server Error"
        });
    }
};

// updateResetPassword

const updateResetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) return res.status(400).json({ message: "All fields are required" });

    try {
        const userExist = await User.findOne({ email });
        if (!userExist) return res.status(400).json({ message: "User not found" });

        const optVerify = await verifyResetTokenForUser(userExist, token);
        if (!optVerify) return res.status(400).json({ message: "Invalid or expired reset token" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userExist.password = hashedPassword;
        userExist.resetPasswordToken = undefined;
        userExist.resetPasswordExpires = undefined;
        await userExist.save();

        return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.log("Error updating password:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

const verifyResetTokenForUser = async (userExist, token) => {
    if (!userExist?.resetPasswordToken || !userExist?.resetPasswordExpires) return false;

    if (userExist.resetPasswordExpires.getTime() < Date.now()) return false;

    const hashedToken = hashResetToken(token);
    return userExist.resetPasswordToken === hashedToken;
};

const verifyResetToken = async (req, res) => {
    const { email, token } = req.body;

    if (!email || !token) {
        return res.status(400).json({ success: false, message: 'Email and token are required' });
    }
    console.log("Verifying reset token for email:", email);
    console.log("Received reset token:", token);

    try {
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const isValidToken = await verifyResetTokenForUser(userExist, token);
        if (!isValidToken) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        return res.status(200).json({ success: true, message: 'Reset token verified successfully' });
    } catch (err) {
        console.log('Error verifying reset token:', err);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};


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
    const { refreshToken } = req.cookies;
    // console.log(refreshToken)
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    try {
        // Clear cookies using the same options used when they were set so the browser will remove them
        const cookieOptions = { httpOnly: true, secure: process.env.ISPROD, sameSite: process.env.ISPROD ? 'None' : 'Lax', path: '/' };
        res.clearCookie('token', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        // Fallback: overwrite cookies with empty value and immediate expiration to ensure removal in some browsers
        res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
        res.cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 });
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
        const otpExist=await OTP.findOne({ email });
        if (otpExist) {
            otpExist.otp = otp; 
            await otpExist.save();
        } else {
            const newOTP = new OTP({ otp, email })
            await newOTP.save();
        }

        sendOTP(email, otp);
        return res.status(200).json({ message: "OTP sent successfully", success: true });
    } catch (err) {
        console.log("Error sending OTP:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const initiateOTPFunc = async (email) => {
    if (!email) {
        throw new Error("Email is required");
    }

    try {
        const otp = generateOTP();

        const otpExist = await OTP.findOne({ email });

        if (otpExist) {
            otpExist.otp = otp;
            await otpExist.save();
        } else {
            const newOTP = new OTP({
                email,
                otp
            });

            await newOTP.save();
        }

        await sendOTP(email, otp);

        return {
            success: true,
            message: "OTP sent successfully"
        };

    } catch (err) {
        console.log("Error sending OTP:", err);
        throw new Error("Server Error");
    }
};

const userVerifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    // console.log("Verifying OTP for email:", email);
    // console.log("Received OTP:", otp);
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
    updateResetPassword,
    verifyResetToken
};



