const jwt = require('jsonwebtoken');
const Blacklist=require('../models/common/blacklist')



const checkAuth = async (req, res, next) => {
    try {

        const token = req.cookies.token
       
          if(token){
              const decoded = jwt.verify(token, process.env.JWT_SECRET)
              req.user = decoded
          }
        const blacklisted = await Blacklist.findOne({ token });
       
        if (blacklisted) {
            return res.status(401).json({ message: "Access denied, token blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(400).json({ message: "Auth Failed", status: "failed", error: error.message });
    }
};

module.exports = {  checkAuth }