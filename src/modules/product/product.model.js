const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  brand: { type: mongoose.Schema.ObjectId, ref: 'Brand', required: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }], // URLs stored after Cloudinary upload
  stock: { type: Number, default: 0 },
  ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
  ratingsQuantity: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes for fast lookup
productSchema.index({ slug: 1 });
productSchema.index({ price: 1 });
productSchema.index({ brand: 1, category: 1 });

// Generate slug before save if not provided
productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
