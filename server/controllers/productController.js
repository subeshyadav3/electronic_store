const Product = require('../models/common/product');
const User = require('../models/customers/user');


const getProducts = async (req, res) => {
  try {
    const { title, price, category, discount, tags, brands } = req.query;
    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (price) {
      const priceRange = price.split('-').map(Number)
      
      if (priceRange.length === 2) {
        filter.price = { $gte: priceRange[0], $lte: priceRange[1] }
      } 

      else {
        filter.price = { $gte: priceRange[0]}
      }
    }

    if (category) {
      filter.category = category;
    }
    if (discount) {
      filter.discount = { $gte: discount };
    }
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    if (brands) {
      filter.brand = brands;
    }
    const products = await Product.find(filter);

    res.status(200).json(products);
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
    const { name, description, price, category, discount, stock } = req.body;

    if (!name || !description || !price || !category || !discount || !stock) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      discount,
      stock,
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
    // console.log(req.params.id);
    // const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    // if (!deletedProduct) {
    //   return res.status(404).json({ message: 'Product not found' });
    // }
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
};
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, user } = req.body;

   

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newComment = {
      user: user,
      comment: comment,
    };
 
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true }
    );

    res.status(201).json({ 
      message: 'Comment added successfully', 
      updatedProduct, 
      success: true 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};


module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct,addComment };
