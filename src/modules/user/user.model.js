const mongoose = require('mongoose');
const validator = require('validator');
const USER_ROLES = require('../../constants/userRoles');

// Address Subdocument Schema
const addressSchema = new mongoose.Schema({
  alias: { type: String, default: 'Home' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: String,
  country: { type: String, required: true },
  postalCode: String,
  phone: String,
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // ميجيش مع الـ queries بشكل افتراضي
    },
    phone: {
      type: String,
      trim: true,
      sparse: true // unique بس لو موجود
    },
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER
    },

    // ========== Verification ==========
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationCode: String,
    verificationCodeExpires: Date,

    // ========== Password Reset ==========
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    passwordChangedAt: Date,

    // ========== OAuth ==========
    googleId: String,

    // ========== Addresses ==========
    addresses: [addressSchema],

    // ========== Wishlist ==========
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ],

    // ========== Loyalty & Referral ==========
    loyaltyPoints: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.ObjectId, ref: 'User' },

    // ========== Status ==========
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ============ Indexes ============
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// ============ Virtuals ============
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ============ Query Middleware ============
// إخفاء الـ users المحذوفين من كل الـ queries
userSchema.pre(/^find/, function () {
  if (this.getOptions().includeInactive) return;
  this.where({ isActive: { $ne: false } });
});

// ============ Hide sensitive data in JSON ============
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.verificationCode;
  delete user.verificationCodeExpires;
  delete user.passwordResetCode;
  delete user.passwordResetExpires;
  delete user.passwordResetVerified;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);