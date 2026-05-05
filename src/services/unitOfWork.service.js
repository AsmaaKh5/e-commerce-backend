const mongoose = require('mongoose');

/**
 * Unit of Work Pattern
 * 
 * بنستخدمه لما يكون عندنا كذا عملية في DB لازم يحصلوا مع بعض
 * (إما كلهم ينجحوا، أو كلهم يتلغوا)
 * 
 * مثال: عمل order = إنشاء طلب + تقليل مخزون + مسح كارت
 */
class UnitOfWork {
  constructor() {
    this.session = null;
  }

  /**
   * بدء transaction جديد
   */
  async start() {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
    return this.session;
  }

  /**
   * تثبيت التغييرات
   */
  async commit() {
    if (this.session) {
      await this.session.commitTransaction();
      await this.session.endSession();
      this.session = null;
    }
  }

  /**
   * إلغاء التغييرات
   */
  async rollback() {
    if (this.session) {
      await this.session.abortTransaction();
      await this.session.endSession();
      this.session = null;
    }
  }

  /**
   * تنفيذ عمليات داخل transaction
   * @param {Function} operations - async function تستقبل session
   */
  async execute(operations) {
    try {
      await this.start();
      const result = await operations(this.session);
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  getSession() {
    return this.session;
  }
}

module.exports = UnitOfWork;