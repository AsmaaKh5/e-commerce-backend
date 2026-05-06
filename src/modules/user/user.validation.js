const { body } = require('express-validator');

exports.updateProfileValidator = [
  body('firstName')
    .optional()
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  
  body('lastName')
    .optional()
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Please provide a valid phone number')
];

exports.changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

exports.addAddressValidator = [
  body('street').notEmpty().withMessage('Street is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('country').notEmpty().withMessage('Country is required')
];