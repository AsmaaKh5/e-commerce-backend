const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const AppError = require('./utils/appError');
const httpStatusText = require('./utils/httpStatusText');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const app = express();

// ============ Global Middlewares ============
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logging
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (للصور)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============ Routes ============
app.get('/', (req, res) => {
  res.json({
    status: httpStatusText.SUCCESS,
    message: '🚀 E-commerce API is running!'
  });
});

// مكان الـ routes (هنضيفهم في الخطوات الجاية)
// app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
// app.use('/api/v1/users', require('./modules/user/user.routes'));
// app.use('/api/v1/products', require('./modules/product/product.routes'));

// ============ 404 Handler ============
app.all(/.*/, (req, res, next) => {
  next(
    AppError.create(
      `Route ${req.originalUrl} not found`,
      404,
      httpStatusText.FAIL
    )
  );
});

// ============ Global Error Handler ============
app.use(globalErrorHandler);

module.exports = app;