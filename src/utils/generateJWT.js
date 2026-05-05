const jwt = require('jsonwebtoken');
const httpStatusText = require('./httpStatusText');

module.exports = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};