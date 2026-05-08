const cartRepository = require('./cart.repository');
const AppError = require('../../utils/appError');
const httpStatusText = require('../../utils/httpStatusText');

class CartService {
  async getUserCart(userId) {
    let cart = await cartRepository.findByUser(userId);
    if (!cart) {
      cart = await cartRepository.create({ user: userId, items: [] });
    }
    return cart;
  }

  async addItem(userId, productId, quantity = 1) {
    return await cartRepository.addItem(userId, productId, quantity);
  }

  async updateItem(userId, itemId, quantity) {
    try {
      return await cartRepository.updateItemQuantity(userId, itemId, quantity);
    } catch (error) {
      throw AppError.create(error.message, 404, httpStatusText.FAIL);
    }
  }

  async removeItem(userId, itemId) {
    try {
      return await cartRepository.removeItem(userId, itemId);
    } catch (error) {
      throw AppError.create(error.message, 404, httpStatusText.FAIL);
    }
  }
}

module.exports = new CartService();