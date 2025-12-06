const mongoose = require("mongoose");

    const paymentItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        min: 1,
        required: true,
    },
    price: {
        type: Number, // price at time of payment
        required: true,
    }
    });

    const paymentSchema = new mongoose.Schema(
    {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

        items: {
        type: [paymentItemSchema],
        required: true,
        },

        totalAmount: {
        type: Number,
        required: true,
        min: 0,
        },

        paymentGateway: {
        type: String,
        enum: ["esewa", "khalti"],
        required: true,
        },

        paymentId: {
        type: String,  // eSewa refId (transaction_code) or Khalti token
        default: null,
        },

        status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
        },

        metadata: {
        type: Object, // for storing raw eSewa/khalti response
        default: {},
        },
    },
    { timestamps: true }
    );

    const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;