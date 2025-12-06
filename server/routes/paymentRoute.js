const express = require("express");
const { createPayment, verifyEsewaPayment } = require("../controllers/paymentController");
const { checkAuth } = require("../middlewares/checkAuthCustomer"); // your auth middleware

const router = express.Router();

router.post("/create", checkAuth, createPayment);
router.post("/verify-esewa", verifyEsewaPayment); 

module.exports = router;
