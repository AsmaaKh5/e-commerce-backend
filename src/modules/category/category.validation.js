const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description can be at most 500 characters')
];

exports.updateCategoryValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description can be at most 500 characters')
];
