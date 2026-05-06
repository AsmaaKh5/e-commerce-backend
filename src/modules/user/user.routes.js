const express = require('express');
const userController = require('./user.controller');
const verifyToken = require('../../middlewares/verifyToken');
const allowedTo = require('../../middlewares/allowedTo');
const validate = require('../../middlewares/validate');
const USER_ROLES = require('../../constants/userRoles');
const {
  updateProfileValidator,
  changePasswordValidator,
  addAddressValidator
} = require('./user.validation');

const router = express.Router();

// كل الـ routes هنا محتاجة authentication
router.use(verifyToken);

// ============ User's Own Profile ============
router.get('/me', userController.getMyProfile);
router.patch('/me', validate(updateProfileValidator), userController.updateMyProfile);
router.delete('/me', userController.deleteMyAccount);
router.patch('/me/change-password', validate(changePasswordValidator), userController.changePassword);

// ============ Address Management ============
router.post('/me/addresses', validate(addAddressValidator), userController.addAddress);
router.patch('/me/addresses/:addressId', userController.updateAddress);
router.delete('/me/addresses/:addressId', userController.removeAddress);

// ============ Admin Routes ============
router.get('/', allowedTo(USER_ROLES.ADMIN), userController.getAllUsers);
router.get('/:id', allowedTo(USER_ROLES.ADMIN), userController.getUserById);
router.patch('/:id/block', allowedTo(USER_ROLES.ADMIN), userController.blockUser);
router.patch('/:id/unblock', allowedTo(USER_ROLES.ADMIN), userController.unblockUser);

module.exports = router;