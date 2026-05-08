const productRepository = require('../../repositories/product.repository');
const AppError = require('../../utils/appError');
const httpStatusText = require('../../utils/httpStatusText');

class ProductService {
  async getAll(query) {
    return await productRepository.findWithFeatures(query, { searchFields: ['name', 'description'] });
  }
  async getOne(id) {
    const product = await productRepository.findById(id, { populate: ['brand', 'category'] });
    if (!product) throw AppError.create('Product not found', 404, httpStatusText.FAIL);
    return product;
  }
  async create(data) {
    // images will be URLs (uploaded via Cloudinary in controller)
    return await productRepository.create(data);
  }
  async update(id, data) {
    const product = await productRepository.updateById(id, data);
    if (!product) throw AppError.create('Product not found', 404, httpStatusText.FAIL);
    return product;
  }
  async delete(id) {
    const product = await productRepository.softDeleteById(id);
    if (!product) throw AppError.create('Product not found', 404, httpStatusText.FAIL);
    return product;
  }
}

module.exports = new ProductService();
