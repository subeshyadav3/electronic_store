const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  addComment,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getAllOrders,
  getHomeProducts
} = require('../controllers/productController');
const checkAdmin = require('../middlewares/checkAdmin');

// Fixed routes first
router.get('/home', getHomeProducts);
router.get('/', getProducts);
router.post('/comment/:id', addComment);

// Parameterized routes next
router.get('/:id', getProductById);
router.post('/', checkAdmin, addProduct);
router.put('/:id', checkAdmin, updateProduct);
router.delete('/:id', checkAdmin, deleteProduct);

// Optional order routes
// router.post('/userOrders/:userId', getOrders);
// router.post('/allOrders', checkAdmin, getAllOrders);

module.exports = router;