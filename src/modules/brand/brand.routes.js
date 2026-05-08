const express = require('express');
const router = express.Router();
const brandController = require('./brand.controller');
const { verifyToken } = require('../../middlewares/verifyToken');
const allowedTo = require('../../middlewares/allowedTo');

// router.use(verifyToken);
// router.use(allowedTo('admin'));

router
  .route('/')
  .get(brandController.getAllBrands)
  .post(brandController.createBrand);

router
  .route('/:id')
  .get(brandController.getBrand)
  .patch(brandController.updateBrand)
  .delete(brandController.deleteBrand);

module.exports = router;
