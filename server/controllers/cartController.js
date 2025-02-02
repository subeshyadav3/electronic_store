const User = require('../models/customers/user');
const Product = require('../models/common/product');

// Add item to cart
const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product Id required" });
        }

        const checkProduct = await Product.findById(productId);
        if (!checkProduct) {
            return res.status(400).json({ message: "Product not found" });
        }

        const getUser = await User.findOne({ email: req.user.email });

        if (!getUser) return res.status(400).json({ message: "Login/Register first" });

        const checkProductInCartAlready = getUser.cart.find(item => item.productId.toString() === productId);

        let updatedUser;
        if (checkProductInCartAlready) {
           
            updatedUser = await User.findOneAndUpdate(
                { _id: getUser._id, "cart.productId": productId },
                { $inc: { 'cart.$.quantity': quantity ? quantity : 1 } },
                { new: true }  
            );
        } else {
            
            updatedUser = await User.findOneAndUpdate(
                { _id: getUser._id },
                { $push: { cart: { productId, quantity } } }, 
                { new: true }  
            );
        }

        return res.status(200).json({ message: "Added to Cart Successfully!!", user: updatedUser });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Get all cart items
const getAllCartItems = async (req, res) => {
    try {
        const getUser = await User.findOne({ email: req.user.email });
        const getAllCartItems = getUser.cart;
        // console.log(getAllCartItems)
        return res.status(200).json({ message: "Retrieved Cart Successfully!", getAllCartItems });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        // const productId=req.params.id;
        const {productId,quantity}=req.body;
        console.log(productId,quantity)
        if (!productId) {
            return res.status(400).json({ message: "Product Id required" });
        }

        const checkProduct = await Product.findById(productId);
        if (!checkProduct) {
            return res.status(400).json({ message: "Product not found" });
        }

        const getUser = await User.findOne({ email: req.user.email });
        if (!getUser) return res.status(400).json({ message: "Something Went Wrong" });

        await User.updateOne(
            { _id: getUser._id, "cart.productId": productId },
            { $set: { "cart.$.quantity": quantity } }
        );

        return res.status(200).json({ message: "Cart Updated Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
};

// Delete item from cart
const deleteCartItem = async (req, res) => {
    try {
        const productId=req.params.id;

        if (!productId) {
            return res.status(400).json({ message: "Product Id required" });
        }

        const getUser = await User.findOne({ email: req.user.email });

        if (!getUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const deletedProduct = await User.updateOne(
            { _id: getUser._id },
            { $pull: { cart: { productId: productId } } }
        );

        if (deletedProduct.nModified === 0) {
            return res.status(400).json({ message: "Product not found in cart" });
        }

        return res.status(200).json({ message: "Item Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
};

// Get specific item from cart
const getCartItemById = async (req, res) => {
    try {
        const productId=req.params.id;
        if (!productId) {
            return res.status(400).json({ message: "Product Id required" });
        }

        const getUser = await User.findOne({ email: req.user.email });
        const getCartWithId = getUser.cart.find(item => item.productId.toString() === productId.toString());

        return res.status(200).json({ message: "Successfully retrieved item", getCartWithId });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
};

module.exports = {
    addItemToCart,
    getAllCartItems,
    updateCartItem,
    deleteCartItem,
    getCartItemById
};
