const BaseRepository = require('../../repositories/base.repository');
const Cart = require('./cart.model');

class CartRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }

  async findByUser(userId, options = {}) {
    return await this.findOne({ user: userId }, { ...options, populate: 'items.product' });
  }

  async addItem(userId, productId, quantity = 1) {
    let cart = await this.findOne({ user: userId });
    if (!cart) {
      cart = await this.create({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }
    return cart;
  }

  async updateItemQuantity(userId, itemId, quantity) {
    const cart = await this.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');

    const item = cart.items.id(itemId);
    if (!item) throw new Error('Item not found in cart');

    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    return cart;
  }

  async removeItem(userId, itemId) {
    const cart = await this.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');

    cart.items.id(itemId).remove();
    await cart.save();
    return cart;
  }
}

module.exports = new CartRepository();