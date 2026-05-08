const BaseRepository = require('../../repositories/base.repository');
const Wishlist = require('./wishlist.model');

class WishlistRepository extends BaseRepository {
  constructor() {
    super(Wishlist);
  }

  async findByUser(userId, options = {}) {
    return await this.findAll({ user: userId }, { ...options, populate: 'product' });
  }

  async findByUserAndProduct(userId, productId) {
    return await this.findOne({ user: userId, product: productId });
  }
}

module.exports = new WishlistRepository();