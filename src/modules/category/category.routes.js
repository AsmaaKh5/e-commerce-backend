const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const { verifyToken } = require('../../middlewares/verifyToken');
const allowedTo = require('../../middlewares/allowedTo');
const validate = require('../../middlewares/validate');
const { createCategoryValidator, updateCategoryValidator } = require('./category.validation');

// router.use(verifyToken);
// router.use(allowedTo('admin'));

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(validate(createCategoryValidator), categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(validate(updateCategoryValidator), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;