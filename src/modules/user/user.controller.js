const asyncWrapper = require('../../middlewares/asyncWrapper');
const userService = require('./user.service');
const httpStatusText = require('../../utils/httpStatusText');

// ============ Profile Operations ============

exports.getMyProfile = asyncWrapper(async (req, res) => {
  const user = await userService.getUserById(req.user.userId);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user }
  });
});

exports.updateMyProfile = asyncWrapper(async (req, res) => {
  const user = await userService.updateProfile(req.user.userId, req.body);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user }
  });
});

exports.changePassword = asyncWrapper(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user.userId, currentPassword, newPassword);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Password changed successfully'
  });
});

exports.deleteMyAccount = asyncWrapper(async (req, res) => {
  await userService.deleteAccount(req.user.userId);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Account deleted successfully'
  });
});

// ============ Address Operations ============

exports.addAddress = asyncWrapper(async (req, res) => {
  const user = await userService.addAddress(req.user.userId, req.body);
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { addresses: user.addresses }
  });
});

exports.removeAddress = asyncWrapper(async (req, res) => {
  const user = await userService.removeAddress(req.user.userId, req.params.addressId);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { addresses: user.addresses }
  });
});

exports.updateAddress = asyncWrapper(async (req, res) => {
  const user = await userService.updateAddress(
    req.user.userId,
    req.params.addressId,
    req.body
  );
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { addresses: user.addresses }
  });
});

// ============ Admin Operations ============

exports.getAllUsers = asyncWrapper(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: result.data.length,
    pagination: result.pagination,
    data: { users: result.data }
  });
});

exports.getUserById = asyncWrapper(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user }
  });
});

exports.blockUser = asyncWrapper(async (req, res) => {
  const user = await userService.blockUser(req.params.id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'User blocked successfully',
    data: { user }
  });
});

exports.unblockUser = asyncWrapper(async (req, res) => {
  const user = await userService.unblockUser(req.params.id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'User unblocked successfully',
    data: { user }
  });
});