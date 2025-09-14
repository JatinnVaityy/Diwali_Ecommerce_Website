const express = require('express');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { adminProtect } = require('../middleware/adminAuth');

const router = express.Router();

// Public: list products (with optional ?q= search)
router.get('/', asyncHandler(async (req, res) => {
  const q = req.query.q;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
}));

// Public: single product
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

// Admin: add product
router.post('/', adminProtect, asyncHandler(async (req, res) => {
  const { name, description, price, stock, image, category } = req.body;
  if (!name || price == null) return res.status(400).json({ message: 'Name and price are required' });
  const p = new Product({ name, description, price, stock: stock || 0, image, category });
  await p.save();
  res.status(201).json(p);
}));

// Admin: update product
router.put('/:id', adminProtect, asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  const { name, description, price, stock, image, category } = req.body;
  p.name = name ?? p.name;
  p.description = description ?? p.description;
  p.price = price ?? p.price;
  p.stock = stock ?? p.stock;
  p.image = image ?? p.image;
  p.category = category ?? p.category;
  await p.save();
  res.json(p);
}));

// Admin: delete product
router.delete('/:id', adminProtect, asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}));

module.exports = router;
