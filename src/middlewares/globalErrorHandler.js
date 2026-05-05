const httpStatusText = require('../utils/httpStatusText');

const handleCastError = (err) => ({
  message: `Invalid ${err.path}: ${err.value}`,
  statusCode: 400,
  statusText: httpStatusText.FAIL
});

const handleDuplicateError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return {
    message: `Duplicate value: ${field} = "${value}" already exists`,
    statusCode: 400,
    statusText: httpStatusText.FAIL
  };
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message
  }));
  return {
    message: errors,
    statusCode: 400,
    statusText: httpStatusText.FAIL
  };
};

const handleJWTError = () => ({
  message: 'Invalid token. Please login again',
  statusCode: 401,
  statusText: httpStatusText.ERROR
});

const handleJWTExpiredError = () => ({
  message: 'Your token has expired. Please login again',
  statusCode: 401,
  statusText: httpStatusText.ERROR
});

module.exports = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // Handle specific errors
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const statusText = error.statusText || httpStatusText.ERROR;

  res.status(statusCode).json({
    status: statusText,
    message: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};