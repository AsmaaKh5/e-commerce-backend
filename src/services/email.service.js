const createTransporter = require('../config/email');

/**
 * Email Service
 * مسؤولة عن إرسال كل أنواع الإيميلات في النظام
 */
class EmailService {
  constructor() {
    this.transporter = createTransporter();
    this.from = `${process.env.SITE_NAME || 'E-Commerce'} <${process.env.EMAIL_FROM}>`;
  }

  /**
   * إرسال إيميل عام
   */
  async sendEmail({ to, subject, html, text }) {
    const mailOptions = {
      from: this.from,
      to,
      subject,
      html,
      text
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Email failed:', error.message);
      throw error;
    }
  }

  /**
   * إرسال كود تأكيد الإيميل
   */
  async sendVerificationCode(email, code, name) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome ${name}! 👋</h2>
        <p>Thanks for signing up. Please verify your email using this code:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #2563eb; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html
    });
  }

  /**
   * إرسال كود إعادة تعيين الباسورد
   */
  async sendPasswordResetCode(email, code, name) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Hi ${name},</h2>
        <p>You requested to reset your password. Use this code:</p>
        <div style="background: #fef3c7; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #d97706; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email or contact support.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html
    });
  }

  /**
   * إرسال تأكيد الطلب
   */
  async sendOrderConfirmation(email, name, order) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Thanks for your order, ${name}! 🎉</h2>
        <p>Order #<strong>${order.orderNumber}</strong></p>
        <p>Total: <strong>$${order.totalPrice}</strong></p>
        <p>We'll notify you when your order ships.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Order Confirmation - #${order.orderNumber}`,
      html
    });
  }

  /**
   * إرسال تحديث حالة الطلب
   */
  async sendOrderStatusUpdate(email, name, order) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Hi ${name},</h2>
        <p>Your order #<strong>${order.orderNumber}</strong> status has been updated to:</p>
        <h3 style="color: #2563eb;">${order.orderStatus.toUpperCase()}</h3>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Order Update - #${order.orderNumber}`,
      html
    });
  }
}

// Singleton instance
module.exports = new EmailService();