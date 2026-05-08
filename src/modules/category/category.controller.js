const categoryRepository = require('../../repositories/category.repository');
const handlerFactory = require('../../utils/handlerFactory');

exports.getAllCategories = handlerFactory.getAll(categoryRepository, {
  modelName: 'categories',
  searchFields: ['name', 'description']
});

exports.getCategory = handlerFactory.getOne(categoryRepository, {
  modelName: 'category'
});

exports.createCategory = handlerFactory.createOne(categoryRepository, {
  modelName: 'category'
});

exports.updateCategory = handlerFactory.updateOne(categoryRepository, {
  modelName: 'category'
});

exports.deleteCategory = handlerFactory.softDeleteOne(categoryRepository, {
  modelName: 'category'
});