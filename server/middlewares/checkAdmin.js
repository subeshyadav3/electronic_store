const jwt = require('jsonwebtoken');
const Blacklist = require('../models/common/blacklist');
const User = require('../models/customers/user');

const checkAuthAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const blacklisted = await Blacklist.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: "Access denied, token blacklisted" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({ message: "Access denied, user not found" });
        }

        if (user.role !== 'admin') {
            return res.status(401).json({ message: "Access denied, user not admin" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Auth Failed", status: "failed", error: error.message });
    }
};

module.exports = checkAuthAdmin;
