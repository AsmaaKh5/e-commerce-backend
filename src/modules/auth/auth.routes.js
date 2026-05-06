const express = require('express');
const authController = require('./auth.controller');
const validate = require('../../middlewares/validate');
const {
  registerValidator,
  loginValidator,
  verifyEmailValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator
} = require('./auth.validation');

const router = express.Router();

router.post('/register', validate(registerValidator), authController.register);
router.post('/verify-email', validate(verifyEmailValidator), authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/login', validate(loginValidator), authController.login);
router.post('/forgot-password', validate(forgotPasswordValidator), authController.forgotPassword);
router.post('/verify-reset-code', validate(verifyResetCodeValidator), authController.verifyResetCode);
router.post('/reset-password', validate(resetPasswordValidator), authController.resetPassword);

module.exports = router;