const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const { verifyToken } = require('../../middlewares/verifyToken');
const allowedTo = require('../../middlewares/allowedTo');
const { uploadMultiple } = require('../../middlewares/upload');

// router.use(verifyToken);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(allowedTo('admin'), uploadMultiple('images', 5), productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(allowedTo('admin'), productController.updateProduct)
  .delete(allowedTo('admin'), productController.deleteProduct);

module.exports = router;