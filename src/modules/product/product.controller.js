const productService = require('./product.service');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const httpStatusText = require('../../utils/httpStatusText');

exports.getAllProducts = asyncWrapper(async (req, res) => {
  const result = await productService.getAll(req.query);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: result.data.length,
    pagination: result.pagination,
    data: { products: result.data }
  });
});

exports.getProduct = asyncWrapper(async (req, res) => {
  const product = await productService.getOne(req.params.id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product }
  });
});

exports.createProduct = asyncWrapper(async (req, res) => {
  // Assume images are uploaded via middleware and URLs are in req.body.images
  const product = await productService.create(req.body);
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { product }
  });
});

exports.updateProduct = asyncWrapper(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product }
  });
});

exports.deleteProduct = asyncWrapper(async (req, res) => {
  await productService.delete(req.params.id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Product deleted successfully'
  });
});