const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Order = require('../models/Order');
const { userProtect } = require('../middleware/userAuth');
const { razorpayClient } = require('../utils/razorpayClient');

const router = express.Router();

// ✅ Create Razorpay Order
router.post('/create', userProtect, asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const options = {
    amount: Math.round(order.totalAmount * 100), // convert ₹ to paise
    currency: "INR",
    receipt: `order_rcptid_${order._id}`,
  };

  const razorpayOrder = await razorpayClient().orders.create(options);

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
}));

// ✅ Verify Razorpay Payment
router.post('/verify', userProtect, asyncHandler(async (req, res) => {
  const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const order = await Order.findById(orderId);
  if (!order || !order.razorpayOrderId) {
    return res.status(404).json({ message: 'Order not found or not created in Razorpay' });
  }

  // Verify signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();
    return res.json({ success: true, message: 'Payment verified', orderId: order._id });
  } else {
    order.paymentStatus = 'failed';
    await order.save();
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
}));

module.exports = router;
