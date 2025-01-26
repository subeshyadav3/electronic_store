const express = require('express');
const router = express.Router();
const {addItemToCart,
  getAllCartItems,
  updateCartItem,
  deleteCartItem,
  getCartItemById} = require('../controllers/cartController');

router.post('/', addItemToCart);
router.get('/', getAllCartItems);
router.put('/:id', updateCartItem);
router.delete('/:id',deleteCartItem);
router.get('/:id', getCartItemById);

module.exports = router;
