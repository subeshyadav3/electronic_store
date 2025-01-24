const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true
        },
        quantity: { 
            type: Number, 
            default: 1 
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    priceAtPurchase: { // Record the price at the time of order
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'shipped', 'delivered'],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    shippedDate: {
        type: Date
    },
    deliveryDate: {
        type: Date
    }
}, { timestamps: true });

//creating compound index on userId and status
orderSchema.index({ userId: 1, status: 1 }); 

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
