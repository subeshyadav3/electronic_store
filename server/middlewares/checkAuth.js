const jwt = require('jsonwebtoken');
const Blacklist=require('../models/common/blacklist')



const checkAuth = async (req, res, next) => {
    try {
        // const authHeader = req.headers.authorization;
        // if (!authHeader) {
        //     return res.status(401).json({ message: "Access denied, no token provided" });
        // }

        // const token = authHeader.split(" ")[1];
        // if (!token) {
        //     return res.status(401).json({ message: "Access denied, no token provided" });
        // }
          //for temporary 
      
        const token = req.cookies.token
        // console.log(token)
       
          if(token){
              const decoded = jwt.verify(token, process.env.JWT_SECRET)
              req.user = decoded
          }
          
        // Check if the token is blacklisted
     
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