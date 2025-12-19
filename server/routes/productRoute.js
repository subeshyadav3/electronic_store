const express = require('express');
const router = express.Router();
const { getProducts, getProductById,addComment, addProduct, updateProduct, deleteProduct,getOrders,getAllOrders} = require('../controllers/productController');
const checkAdmin = require('../middlewares/checkAdmin');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/',checkAdmin, addProduct);
router.put('/:id', checkAdmin, updateProduct);
router.delete('/:id', checkAdmin, deleteProduct);
router.post('/comment/:id', addComment);
// router.post('/userOrders/:userId', getOrders);
// router.post('/allOrders', checkAdmin, getAllOrders);

module.exports = router;
