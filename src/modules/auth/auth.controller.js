const asyncWrapper = require('../../middlewares/asyncWrapper');
const authService = require('./auth.service');
const httpStatusText = require('../../utils/httpStatusText');

exports.register = asyncWrapper(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    ...result
  });
});

exports.verifyEmail = asyncWrapper(async (req, res) => {
  const result = await authService.verifyEmail(req.body.code);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    ...result
  });
});

exports.resendVerification = asyncWrapper(async (req, res) => {
  const result = await authService.resendVerificationCode(req.body.email);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    ...result
  });
});

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    ...result
  });
});

exports.forgotPassword = asyncWrapper(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    ...result
  });
});

exports.verifyResetCode = asyncWrapper(async (req, res) => {
  const result = await authService.verifyResetCode(req.body.resetCode);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    ...result
  });
});

exports.resetPassword = asyncWrapper(async (req, res) => {
  const { email, newPassword } = req.body;
  const result = await authService.resetPassword(email, newPassword);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    ...result
  });
});