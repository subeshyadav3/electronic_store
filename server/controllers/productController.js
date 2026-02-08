const Product = require('../models/common/product');
const User = require('../models/customers/user');
const Order = require('../models/customers/order');
const mongoose = require('mongoose');
const redis = require('../utils/redis'); // Redis client

const getProducts = async (req, res) => {
  try {
    const sortedQuery = Object.keys(req.query).sort().reduce((acc, key) => {
      acc[key] = req.query[key];
      return acc;
    }, {});
    const cacheKey = `products:${JSON.stringify(sortedQuery)}`;

    // Check cache first
    const cachedProducts = await redis.get(cacheKey);
    if (cachedProducts) return res.status(200).json(JSON.parse(cachedProducts)); // parse JSON

    const { title, price, category, discount, tags, brands } = req.query;

    const filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (price) {
      const priceRange = price.split('-').map(Number);
      filter.price = priceRange.length === 2 ? { $gte: priceRange[0], $lte: priceRange[1] } : { $gte: priceRange[0] };
    }
    if (category) filter.category = category;
    if (discount) filter.discount = { $gte: discount };
    if (tags) filter.tags = { $in: tags.split(',') };
    if (brands) filter.brand = brands;

    const products = await Product.find(filter).lean();

    // Set cache with JSON string
    await redis.set(cacheKey, JSON.stringify(products), 'EX', 60); // expire in 60 sec

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getProductById = async (req, res) => {
  try {
    const cacheKey = `product:${req.params.id}`;
    const cachedProduct = await redis.get(cacheKey);
    if (cachedProduct) return res.status(200).json(JSON.parse(cachedProduct)); // parse JSON

    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await redis.set(cacheKey, JSON.stringify(product), 'EX', 120); // expire in 2 min
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const addProduct = async (req, res) => {
  try {
    // Clear relevant caches
    const keys = await redis.keys('products:*');
    if (keys.length) await redis.del(keys);

    const {
      title, description, price, category, discountPercentage, stock,
      brand, sku, weight, dimensions, tags, warrantyInformation,
      returnPolicy, shippingInformation, availabilityStatus, minimumOrderQuantity,
      meta, images, thumbnail
    } = req.body;

    if (!title || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newProduct = new Product({
      title, description, price, category, discount: discountPercentage || 0,
      stock, brand: brand || "Others", sku, weight, dimensions,
      tags: tags || [], warrantyInformation: warrantyInformation || "No Warranty",
      returnPolicy: returnPolicy || "No Returns",
      shippingInformation: shippingInformation || "Ships in 1 week",
      availabilityStatus: availabilityStatus || "In Stock",
      minimumOrderQuantity: minimumOrderQuantity || 1,
      meta, images: images || [], thumbnail
    });

    const savedProduct = await newProduct.save();

    await User.findByIdAndUpdate(req.user.userId, { $push: { productsCreated: savedProduct._id } });

    res.status(201).json({ message: 'Product Created Successfully!', product: savedProduct, success: true });
  } catch (err) {
    res.status(400).json({ message: "Error creating product", error: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Clear caches
    await redis.del(`product:${req.params.id}`);
    const keys = await redis.keys('products:*');
    if (keys.length) await redis.del(keys);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, { $set: req.body }, { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

 
    const deletedProduct = await Product.findByIdAndDelete(productId);
    console.log(deletedProduct);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Clear caches
    await redis.del(`product:${productId}`);
    const keys = await redis.keys('products:*');
    if (keys.length) await redis.del(keys);

    res.status(200).json({ message: 'Product deleted successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    await redis.del(`product:${id}`); // clear cache

    const { comment, user, reply, parentId } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let newComment = null;
    let updatedProduct = null;
    if (!reply) {
      newComment = { user, comment, reply: [] };
      updatedProduct = await Product.findByIdAndUpdate(id, { $push: { comments: newComment } }, { new: true });
    } else {
      const newReply = { user, comment };
      updatedProduct = await Product.findByIdAndUpdate(
        id, { $push: { "comments.$[comment].reply": newReply } },
        { new: true, arrayFilters: [{ "comment._id": parentId }] }
      );
    }

    res.status(201).json({ message: 'Comment added successfully', updatedProduct, success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

const addOrders = async (userId, items, shippingAddress) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!items || items.length === 0) throw new Error("Order must have at least one product");
    if (!shippingAddress.email || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city) {
      throw new Error("Valid shipping address is required");
    }

    const products = items.map((item) => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity || 1,
      priceAtPurchase: item.price
    }));

    const totalAmount = products.reduce((total, item) => total + item.priceAtPurchase * item.quantity, 0);

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(userId),
      products,
      totalAmount,
      shippingAddress: {
        street: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode || "",
        country: shippingAddress.country || "Nepal",
        fullName: shippingAddress.fullName,
        email: shippingAddress.email
      },
      discount: 0,
      status: 'paid'
    });

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    return order;
  } catch (err) {
    throw new Error("Error creating order: " + err.message);
  }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct, addComment, addOrders };
