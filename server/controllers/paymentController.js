const Payment = require("../models/customers/paymentModel");
const crypto = require("crypto");
const axios = require("axios");
const User = require("../models/customers/user");
const mongoose = require('mongoose');
// Generate HMAC-SHA256 signature in Base64
// Signature generation
const generateSignature = (data, signed_field_names) => {
  const secret = process.env.ESEWA_SECRET_KEY;
  if (!secret) throw new Error("ESEWA_SECRET_KEY is not defined");

  const fields = signed_field_names.split(",");
  const dataString = fields.map(f => `${f}=${data[f]}`).join(","); // ✅ key=value
  return crypto.createHmac("sha256", secret).update(dataString).digest("base64");
};



exports.createPayment = async (req, res) => {
  try {
    const { items, totalAmount, paymentGateway } = req.body;

    if (!items || items.length === 0) return res.status(400).json({ message: "Cart is empty" });
    if (!totalAmount || totalAmount <= 0) return res.status(400).json({ message: "Invalid total amount" });
    if (paymentGateway !== "esewa") return res.status(400).json({ message: "Unsupported payment gateway" });

    // Save payment record
    const payment = new Payment({
      user: req.user.userId,
      items,
      totalAmount,
      paymentGateway,
      status: "PENDING",
    });
    await payment.save();

    // eSewa parameters
    const amount = totalAmount;
    const tax_amount = 0;
    const product_service_charge = 0;
    const product_delivery_charge = 0;
    const total_amount = (amount + tax_amount + product_service_charge + product_delivery_charge).toFixed(2);
    const transaction_uuid = payment._id.toString();
    const product_code = process.env.ESEWA_MERCHANT_ID;

    const signed_field_names = "total_amount,transaction_uuid,product_code";
    const esewaData = { total_amount, transaction_uuid, product_code };

    // generate correct signature
    const signature = generateSignature(esewaData, signed_field_names);
    const esewaFormData = {
      amount: amount.toFixed(2),
      tax_amount: tax_amount.toFixed(2),
      product_service_charge: product_service_charge.toFixed(2),
      product_delivery_charge: product_delivery_charge.toFixed(2),
      total_amount,
      transaction_uuid,
      product_code,
      success_url: `${process.env.FRONTEND_URL}/checkout?esewa_callback=success`,
      failure_url: `${process.env.FRONTEND_URL}/checkout?esewa_callback=failed`,
      signed_field_names,
      signature,
    };

    console.log("eSewa Form Data:", esewaFormData);
    return res.status(200).json({
      message: "Payment created",
      paymentId: payment._id,
      esewaUrl: process.env.ESEWA_PAYMENT_URL,
      esewaFormData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Verify Payment (Base64 response from eSewa)
exports.verifyEsewaPayment = async (req, res) => {
  try {
    const { responseData,items } = req.body;
    if (!responseData) return res.status(400).json({ message: "Missing eSewa response" });
    console.log("Items in verification:", items);
    console.log("eSewa Response Data:", responseData);
    const decoded = Buffer.from(responseData, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);

    const { transaction_uuid, signed_field_names, signature: receivedSignature } = parsed;

    // Corrected signature verification
    const generatedSignature = generateSignature(parsed, signed_field_names);
    if (generatedSignature !== receivedSignature) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const payment = await Payment.findById(transaction_uuid);
    if (!payment) return res.status(404).json({ message: "Payment record not found" });

    // Status check API
    const statusUrl = `${process.env.ESEWA_VERIFICATION_URL}?product_code=${parsed.product_code}&total_amount=${parsed.total_amount}&transaction_uuid=${transaction_uuid}`;
    const apiRes = await axios.get(statusUrl);
    const finalStatus = apiRes.data?.status;

    if (finalStatus === "COMPLETE") {
      payment.status = "SUCCESS";
      payment.paymentId = parsed.transaction_code;
      payment.metadata = { ...apiRes.data, initialCallback: parsed };
      await payment.save();

      // delete the items from user's selected items from cart after successful payment
      const userId = req.user.userId;
      // console.log("Clearing cart for user:", userId);
      const parsedItems = JSON.parse(items);
      const productIds = parsedItems.map(
      i => new mongoose.Types.ObjectId(i.productId)
      );

      const result=await User.updateOne(
        { _id: userId },
        { $pull: { cart: { productId: { $in: productIds } } } }
      );
      // console.log("Cart cleared:", result);
      return res.status(200).json({ message: "Payment verified", payment });
    } else {
      payment.status = "FAILED";
      payment.paymentId = parsed.transaction_code;
      payment.metadata = { ...apiRes.data, initialCallback: parsed };
      await payment.save();
      return res.status(400).json({ message: `Payment ${finalStatus}`, payment });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};