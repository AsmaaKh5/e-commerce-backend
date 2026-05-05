const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

module.exports = (validations) => {
  return async (req, res, next) => {
    // شغّلي كل الـ validators
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    // رجّعي الأخطاء بشكل منظم
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg
    }));

    return next(
      AppError.create(extractedErrors, 400, httpStatusText.FAIL)
    );
  };
};