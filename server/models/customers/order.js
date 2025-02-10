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
    priceAtPurchase: { // price record because it may change
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'shipped', 'delivered'],
        default: 'pending'
    },
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: String,
        postalCode: String,
        country: {
            type: String,
            default: 'Nepal'

        }

    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    shippedDate: {
        type: Date,
        default: null

    },
    deliveryDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

//creating compound index on userId and status
orderSchema.index({ userId: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
