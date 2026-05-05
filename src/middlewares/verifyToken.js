const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next) => {
  try {
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(
        AppError.create('Access token required', 401, httpStatusText.ERROR)
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    req.user = decoded;
    next();
  } catch (error) {
    next(
      AppError.create('Invalid token', 401, httpStatusText.ERROR)
    );
  }
};

module.exports = verifyToken;