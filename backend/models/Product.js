const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String }, // base64 or URL
  category: { type: String },
  slug: { type: String, unique: true, index: true }, // <--- add this
  createdAt: { type: Date, default: Date.now }
});

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
