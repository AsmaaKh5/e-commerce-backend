const categoryRepository = require('../../repositories/category.repository');
const AppError = require('../../utils/appError');
const httpStatusText = require('../../utils/httpStatusText');

class CategoryService {
  async getAll(query) {
    return await categoryRepository.findWithFeatures(query, { searchFields: ['name', 'description'] });
  }
  async getOne(id) {
    const category = await categoryRepository.findById(id);
    if (!category) throw AppError.create('Category not found', 404, httpStatusText.FAIL);
    return category;
  }
  async create(data) {
    return await categoryRepository.create(data);
  }
  async update(id, data) {
    const category = await categoryRepository.updateById(id, data);
    if (!category) throw AppError.create('Category not found', 404, httpStatusText.FAIL);
    return category;
  }
  async delete(id) {
    const category = await categoryRepository.softDeleteById(id);
    if (!category) throw AppError.create('Category not found', 404, httpStatusText.FAIL);
    return category;
  }
}
module.exports = new CategoryService();
