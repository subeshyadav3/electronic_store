const jwt = require('jsonwebtoken');
const Blacklist = require('../models/common/blacklist');

const checkCustomer = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const blacklisted = await Blacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: 'Access denied, token blacklisted' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied, only customers allowed' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth Failed', status: 'failed', error: error.message });
  }
};

module.exports = checkCustomer;
