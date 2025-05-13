const express=require('express')
const router=express.Router();
const {getCustomerUserUpdate}=require('../controllers/admin')




router.put('/:id',getCustomerUserUpdate);


module.exports = router;