const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index to ensure unique user-product pairs
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);