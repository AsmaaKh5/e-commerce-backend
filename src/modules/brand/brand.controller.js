const handlerFactory = require('../../utils/handlerFactory');
const brandRepository = require('../../repositories/brand.repository');

exports.getAllBrands = handlerFactory.getAll(brandRepository, { modelName: 'brands', searchFields: ['name'] });
exports.getBrand = handlerFactory.getOne(brandRepository, { modelName: 'brand' });
exports.createBrand = handlerFactory.createOne(brandRepository, { modelName: 'brand' });
exports.updateBrand = handlerFactory.updateOne(brandRepository, { modelName: 'brand' });
exports.deleteBrand = handlerFactory.softDeleteOne(brandRepository, { modelName: 'brand' });
