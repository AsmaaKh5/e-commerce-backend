const { body } = require('express-validator');
const USER_ROLES = require('../../constants/userRoles');

exports.registerValidator = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  
  body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Please provide a valid phone number'),
  
  body('role')
    .optional()
    .isIn([USER_ROLES.CUSTOMER, USER_ROLES.SELLER])
    .withMessage('Invalid role')
];

exports.loginValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.verifyEmailValidator = [
  body('code')
    .notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
];

exports.forgotPasswordValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
];

exports.verifyResetCodeValidator = [
  body('resetCode')
    .notEmpty().withMessage('Reset code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
];

exports.resetPasswordValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.verifyEmailValidator = [
  body('code')
    .notEmpty().withMessage('Verification code is required')
    .isString().withMessage('Code must be a string')
    .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
];