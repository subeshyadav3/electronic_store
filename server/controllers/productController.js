const Product = require('../models/common/product');
const User = require('../models/customers/user');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).render('home', { products });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      createdBy: req.user?.userId,
    });

    const savedProduct = await newProduct.save();

    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { productsCreated: savedProduct._id } }
    );

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error creating product', error: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
