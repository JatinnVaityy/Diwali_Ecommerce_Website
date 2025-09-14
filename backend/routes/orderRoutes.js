const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { userProtect } = require('../middleware/userAuth');
const { adminProtect } = require('../middleware/adminAuth');

const router = express.Router();

// Create order (requires logged-in user)
router.post('/', userProtect, asyncHandler(async (req, res) => {
  const { customerName, customerEmail, address, items } = req.body;
  if (!customerName || !customerEmail || !address || !items || !items.length) {
    return res.status(400).json({ message: 'Missing order info' });
  }

  // calculate total and reduce stock atomically-ish (simple implementation)
  let total = 0;
  const lineItems = [];

  for (const it of items) {
    const p = await Product.findById(it.productId);
    if (!p) return res.status(400).json({ message: `Product ${it.productId} not found` });
    if (p.stock < it.qty) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
    total += p.price * it.qty;
    lineItems.push({ productId: p._id, name: p.name, qty: it.qty, price: p.price });
  }

  // Deduct stock after checks
  for (const it of items) {
    await Product.findByIdAndUpdate(it.productId, { $inc: { stock: -it.qty } });
  }

  const order = new Order({
    user: req.user._id,
    customerName,
    customerEmail,
    address,
    items: lineItems,
    totalAmount: total
  });
  await order.save();

  // In production: integrate payment integration and webhooks,
  // set paymentStatus accordingly. For now default 'pending'.
  res.status(201).json({ orderId: order._id, paymentStatus: order.paymentStatus });
}));

// Get orders for current user
router.get('/my', userProtect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.productId');
  res.json(orders);
}));

// Admin: list all orders
router.get('/', adminProtect, asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('items.productId').populate('user', 'name email');
  res.json(orders);
}));

// Admin: get specific order
router.get('/:id', adminProtect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.productId').populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

module.exports = router;
