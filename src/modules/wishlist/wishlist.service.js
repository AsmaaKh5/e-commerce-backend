const wishlistRepository = require('./wishlist.repository');
const AppError = require('../../utils/appError');
const httpStatusText = require('../../utils/httpStatusText');

class WishlistService {
  async getUserWishlist(userId) {
    return await wishlistRepository.findByUser(userId);
  }

  async addToWishlist(userId, productId) {
    // Check if already exists
    const existing = await wishlistRepository.findByUserAndProduct(userId, productId);
    if (existing) {
      throw AppError.create('Product already in wishlist', 400, httpStatusText.FAIL);
    }

    return await wishlistRepository.create({ user: userId, product: productId });
  }

  async removeFromWishlist(userId, productId) {
    const wishlistItem = await wishlistRepository.findByUserAndProduct(userId, productId);
    if (!wishlistItem) {
      throw AppError.create('Product not found in wishlist', 404, httpStatusText.FAIL);
    }

    await wishlistRepository.deleteById(wishlistItem._id);
    return { message: 'Product removed from wishlist' };
  }
}

module.exports = new WishlistService();