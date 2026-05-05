const AppError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const USER_ROLES = require('../constants/userRoles');

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        AppError.create(
          'You are not authorized to access this resource', 
          403, 
          httpStatusText.FAIL
        )
      );
    }
    next();
  };
};