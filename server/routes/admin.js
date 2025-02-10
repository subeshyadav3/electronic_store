const express=require('express')
const router=express.Router();

const {getAdminUsers,getAdminUsersById,getAdminUsersUpdate,getAdminUsersDelete,getAdminOrders,getAdminOrdersById,getAdminOrdersUpdate}=require('../controllers/admin')


router.get('/users',getAdminUsers);
router.get('/users/:id',getAdminUsersById);
router.put('/users/:id',getAdminUsersUpdate);
router.delete('/users/:id',getAdminUsersDelete);


router.get('/orders',getAdminOrders);
router.get('/orders/:id',getAdminOrdersById);
router.post('/orders/:id',getAdminOrdersUpdate);

module.exports = router;