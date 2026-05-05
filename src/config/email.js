const nodemailer = require('nodemailer');

/**
 * إعداد Nodemailer Transporter
 * هنستخدم Gmail
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD // App Password من Gmail
    }
  });
};

module.exports = createTransporter;