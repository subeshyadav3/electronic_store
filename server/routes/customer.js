const express=require('express')
const router=express.Router();
const {
    getCustomerUserUpdate,
    getCustomerUserById,
    getCustomerOrders,
    getCustomerOrderById

}=require('../controllers/customer')



// Orders routes first
router.get('/orders/:orderId', getCustomerOrderById);
router.get('/orders', getCustomerOrders);

// Then user routes
router.put('/:id', getCustomerUserUpdate);
router.get('/:id', getCustomerUserById);

module.exports = router;