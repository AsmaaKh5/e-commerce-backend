const BaseRepository = require('./base.repository');
const User = require('../modules/user/user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  // ============ Find Methods ============

  async findByEmail(email, options = {}) {
    return await this.findOne({ email: email.toLowerCase() }, options);
  }

  /**
   * Find user with password (for login)
   * بنحتاجها لأن password عليه select: false
   */
  async findByEmailWithPassword(email) {
    return await this.model
      .findOne({ email: email.toLowerCase() })
      .select('+password');
  }

  async findByVerificationCode(code) {
    return await this.findOne({
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });
  }

  async findByPasswordResetCode(code) {
    return await this.findOne({
      passwordResetCode: code,
      passwordResetExpires: { $gt: Date.now() }
    });
  }

  async findByGoogleId(googleId) {
    return await this.findOne({ googleId });
  }

  async findByReferralCode(code) {
    return await this.findOne({ referralCode: code });
  }

  // ============ Wishlist Methods ============

  async addToWishlist(userId, productId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    );
  }

  async removeFromWishlist(userId, productId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );
  }

  async getWishlist(userId) {
    return await this.model
      .findById(userId)
      .populate('wishlist')
      .select('wishlist');
  }

  // ============ Address Methods ============

  async addAddress(userId, address) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { addresses: address } },
      { new: true }
    );
  }

  async removeAddress(userId, addressId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );
  }

  async updateAddress(userId, addressId, addressData) {
    const updates = {};
    Object.keys(addressData).forEach((key) => {
      updates[`addresses.$.${key}`] = addressData[key];
    });

    return await this.model.findOneAndUpdate(
      { _id: userId, 'addresses._id': addressId },
      { $set: updates },
      { new: true }
    );
  }

  // ============ Loyalty Points ============

  async addLoyaltyPoints(userId, points) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );
  }

  async deductLoyaltyPoints(userId, points) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: -points } },
      { new: true }
    );
  }

  // ============ Update Methods ============

  async updatePassword(userId, hashedPassword) {
    return await this.model.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        passwordChangedAt: Date.now()
      },
      { new: true }
    );
  }

  async setVerified(userId) {
    return await this.model.findByIdAndUpdate(
      userId,
      {
        isVerified: true,
        $unset: {
          verificationCode: 1,
          verificationCodeExpires: 1
        }
      },
      { new: true }
    );
  }

  async blockUser(userId) {
    return await this.updateById(userId, { isBlocked: true });
  }

  async unblockUser(userId) {
    return await this.updateById(userId, { isBlocked: false });
  }
}

module.exports = new UserRepository();