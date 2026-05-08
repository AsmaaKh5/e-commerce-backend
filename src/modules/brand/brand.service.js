const brandRepository = require('../../repositories/brand.repository');
const AppError = require('../../utils/appError');
const httpStatusText = require('../../utils/httpStatusText');

class BrandService {
  async getAll(query) {
    return await brandRepository.findWithFeatures(query, { searchFields: ['name'] });
  }
  async getOne(id) {
    const brand = await brandRepository.findById(id);
    if (!brand) throw AppError.create('Brand not found', 404, httpStatusText.FAIL);
    return brand;
  }
  async create(data) {
    return await brandRepository.create(data);
  }
  async update(id, data) {
    const brand = await brandRepository.updateById(id, data);
    if (!brand) throw AppError.create('Brand not found', 404, httpStatusText.FAIL);
    return brand;
  }
  async delete(id) {
    const brand = await brandRepository.softDeleteById(id);
    if (!brand) throw AppError.create('Brand not found', 404, httpStatusText.FAIL);
    return brand;
  }
}
module.exports = new BrandService();
