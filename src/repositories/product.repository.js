const BaseRepository = require('./base.repository');
const Product = require('../modules/product/product.model');

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }
}

module.exports = new ProductRepository();
