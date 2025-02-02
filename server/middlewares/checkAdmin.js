const jwt = require('jsonwebtoken');
const Blacklist=require('../models/common/blacklist')



const checkAuthAdmin = async (req, res, next) => {
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

        if(req.user.role !== "admin"){
            return res.status(401).json({ message: "Access denied, only admin allowed" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Auth Failed", status: "failed", error: error.message });
    }
};

module.exports = checkAuthAdmin