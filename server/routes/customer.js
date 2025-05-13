const express=require('express')
const router=express.Router();
const {
    getCustomerUserUpdate,
    getCustomerUserById,
    getCustomerOrders

}=require('../controllers/customer')




router.put('/:id',getCustomerUserUpdate);

router.get('/:id',getCustomerUserById);

router.get('/orders/:id',getCustomerOrders);


module.exports = router;