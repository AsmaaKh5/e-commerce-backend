const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userRepository = require('../../repositories/user.repository');
const emailService = require('../../services/email.service');
const generateJWT = require('../../utils/generateJWT');
const AppError = require('../../utils/appError');
const httpStatusText = require('../../utils/httpStatusText');

class AuthService {
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateReferralCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  async createToken(user) {
    return await generateJWT({
      userId: user._id,
      email: user.email,
      role: user.role
    });
  }

  async register(userData) {
    const { email, password, referralCode } = userData;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw AppError.create('Email already registered', 400, httpStatusText.FAIL);
    }

    userData.password = await bcrypt.hash(password, 12);

    userData.verificationCode = this.generateVerificationCode();
    userData.verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    userData.referralCode = this.generateReferralCode();

    if (referralCode) {
      const referrer = await userRepository.findByReferralCode(referralCode);
      if (referrer) {
        userData.referredBy = referrer._id;
        await userRepository.addLoyaltyPoints(referrer._id, 50);
      }
    }

    const user = await userRepository.create(userData);

    try {
      await emailService.sendVerificationCode(
        user.email,
        userData.verificationCode,
        user.firstName
      );
    } catch (error) {
      await userRepository.deleteById(user._id);
      throw AppError.create(
        'Failed to send verification email. Please try again',
        500,
        httpStatusText.ERROR
      );
    }

    return {
      message: 'Registration successful. Please check your email to verify your account',
      userId: user._id,
      email: user.email
    };
  }

  async verifyEmail(code) {
    const user = await userRepository.findByVerificationCode(code);
    if (!user) {
      throw AppError.create(
        'Invalid or expired verification code',
        400,
        httpStatusText.FAIL
      );
    }
    await userRepository.setVerified(user._id);
    const token = await this.createToken(user);
    return {
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role
      }
    };
  }

  async resendVerificationCode(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw AppError.create('User not found', 404, httpStatusText.FAIL);
    }
    if (user.isVerified) {
      throw AppError.create('Email already verified', 400, httpStatusText.FAIL);
    }
    const verificationCode = this.generateVerificationCode();
    await userRepository.updateById(user._id, {
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000
    });
    await emailService.sendVerificationCode(user.email, verificationCode, user.firstName);
    return { message: 'Verification code sent to your email' };
  }

  async login(email, password) {
    if (!email || !password) {
      throw AppError.create('Email and password are required', 400, httpStatusText.FAIL);
    }
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw AppError.create('Invalid email or password', 401, httpStatusText.FAIL);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw AppError.create('Invalid email or password', 401, httpStatusText.FAIL);
    }
    if (user.isBlocked) {
      throw AppError.create(
        'Your account has been blocked. Please contact support',
        403,
        httpStatusText.FAIL
      );
    }
    if (!user.isVerified) {
      throw AppError.create('Please verify your email first', 403, httpStatusText.FAIL);
    }
    const token = await this.createToken(user);
    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar
      }
    };
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw AppError.create('No user found with this email', 404, httpStatusText.FAIL);
    }
    const resetCode = this.generateVerificationCode();
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
    await userRepository.updateById(user._id, {
      passwordResetCode: hashedResetCode,
      passwordResetExpires: Date.now() + 10 * 60 * 1000,
      passwordResetVerified: false
    });
    try {
      await emailService.sendPasswordResetCode(user.email, resetCode, user.firstName);
    } catch (error) {
      await userRepository.updateById(user._id, {
        $unset: {
          passwordResetCode: 1,
          passwordResetExpires: 1,
          passwordResetVerified: 1
        }
      });
      throw AppError.create(
        'Failed to send reset email. Please try again',
        500,
        httpStatusText.ERROR
      );
    }
    return { message: 'Reset code sent to your email' };
  }

  async verifyResetCode(resetCode) {
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
    const user = await userRepository.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
      throw AppError.create('Invalid or expired reset code', 400, httpStatusText.FAIL);
    }
    await userRepository.updateById(user._id, { passwordResetVerified: true });
    return { message: 'Reset code verified. You can now reset your password' };
  }

  async resetPassword(email, newPassword) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw AppError.create('User not found', 404, httpStatusText.FAIL);
    }
    if (!user.passwordResetVerified) {
      throw AppError.create(
        'Please verify your reset code first',
        400,
        httpStatusText.FAIL
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userRepository.updateById(user._id, {
      password: hashedPassword,
      passwordChangedAt: Date.now(),
      $unset: {
        passwordResetCode: 1,
        passwordResetExpires: 1,
        passwordResetVerified: 1
      }
    });
    const token = await this.createToken(user);
    return { message: 'Password reset successfully', token };
  }
}

module.exports = new AuthService();