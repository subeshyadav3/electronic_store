const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const checkAdmin = require('../middlewares/checkAdmin');
// const {upload}=require('../index.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/',checkAdmin, addProduct);
router.put('/:id', checkAdmin, updateProduct);
router.delete('/:id', checkAdmin, deleteProduct);

module.exports = router;
