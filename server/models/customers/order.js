const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  products: {
    type: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      priceAtPurchase: {
        type: Number,
        required: true
      }
    }],
    required: true
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  discount: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: [
      'created',
      'paid',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'created'
  },

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    postalCode: String,
    country: { type: String, default: 'Nepal' }
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
    type: Date
  }

}, { timestamps: true });

orderSchema.index({ userId: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
