const bcrypt = require('bcryptjs');
const userRepository = require('../../repositories/user.repository');
const AppError = require('../../utils/appError');
const httpStatusText = require('../../utils/httpStatusText');

class UserService {
  /**
   * جلب كل المستخدمين (للأدمن)
   */
  async getAllUsers(queryString) {
    return await userRepository.findWithFeatures(queryString, {
      searchFields: ['firstName', 'lastName', 'email']
    });
  }

  /**
   * جلب user واحد
   */
  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.create('User not found', 404, httpStatusText.FAIL);
    }
    return user;
  }

  /**
   * تحديث الـ profile (بدون password)
   */
  async updateProfile(userId, updates) {
    // منع تحديث الباسورد من هنا
    const forbiddenFields = ['password', 'role', 'email', 'isVerified', 'isBlocked'];
    forbiddenFields.forEach((field) => delete updates[field]);

    const user = await userRepository.updateById(userId, updates);
    if (!user) {
      throw AppError.create('User not found', 404, httpStatusText.FAIL);
    }
    return user;
  }

  /**
   * تغيير الباسورد (المستخدم لازم يدخل القديم)
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId, { select: '+password' });
    if (!user) {
      throw AppError.create('User not found', 404, httpStatusText.FAIL);
    }

    // التأكد من الباسورد الحالي
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw AppError.create('Current password is incorrect', 401, httpStatusText.FAIL);
    }

    // تشفير الباسورد الجديد
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return await userRepository.updatePassword(userId, hashedPassword);
  }

  /**
   * Soft delete (حذف الحساب)
   */
  async deleteAccount(userId) {
    const user = await userRepository.softDeleteById(userId);
    if (!user) {
      throw AppError.create('User not found', 404, httpStatusText.FAIL);
    }
    return user;
  }

  // ============ Address Management ============

  async addAddress(userId, addressData) {
    return await userRepository.addAddress(userId, addressData);
  }

  async removeAddress(userId, addressId) {
    return await userRepository.removeAddress(userId, addressId);
  }

  async updateAddress(userId, addressId, addressData) {
    const user = await userRepository.updateAddress(userId, addressId, addressData);
    if (!user) {
      throw AppError.create('Address not found', 404, httpStatusText.FAIL);
    }
    return user;
  }

  // ============ Admin Operations ============

  async blockUser(userId) {
    const user = await userRepository.blockUser(userId);
    if (!user) {
      throw AppError.create('User not found', 404, httpStatusText.FAIL);
    }
    return user;
  }

  async unblockUser(userId) {
    const user = await userRepository.unblockUser(userId);
    if (!user) {
      throw AppError.create('User not found', 404, httpStatusText.FAIL);
    }
    return user;
  }
}

module.exports = new UserService();