# 🛍️ E-Commerce Multi-Vendor Backend (MEAN Stack)

A scalable, production-ready RESTful API for a multi-vendor e-commerce platform built with **Node.js**, **Express**, and **MongoDB**.

## 🏗️ Architecture

This project follows a **clean layered architecture** with separation of concerns:

```
┌──────────────────────────────────────────┐
│  Routes Layer  →  Define endpoints       │
├──────────────────────────────────────────┤
│  Controllers   →  Handle HTTP requests   │
├──────────────────────────────────────────┤
│  Services      →  Business logic         │
├──────────────────────────────────────────┤
│  Repositories  →  Database operations    │
├──────────────────────────────────────────┤
│  Models        →  Data schemas           │
└──────────────────────────────────────────┘
```

### Design Patterns Applied
- **Repository Pattern** - Encapsulates data access logic
- **Service Layer Pattern** - Centralizes business logic
- **Unit of Work Pattern** - Manages database transactions
- **Factory Pattern** - Reusable handlers for CRUD operations
- **Singleton Pattern** - For shared services (Email, etc.)

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Email Service:** Nodemailer
- **File Upload:** Multer + Cloudinary
- **Payment:** Stripe
- **Security:** Helmet, CORS, bcryptjs

## 📁 Project Structure

```
src/
├── config/              # Configuration files (DB, Email, Cloudinary)
├── constants/           # Application constants (roles, statuses)
├── middlewares/         # Express middlewares
│   ├── allowedTo.js          # Role-based access control
│   ├── asyncWrapper.js       # Async error handling
│   ├── globalErrorHandler.js # Centralized error handling
│   ├── upload.js             # File upload (Multer)
│   ├── validate.js           # Validation middleware
│   └── verifyToken.js        # JWT verification
├── modules/             # Feature-based modules (Auth, User, Product, etc.)
├── repositories/        # Data access layer
│   └── base.repository.js    # Generic CRUD repository
├── services/            # Shared services
│   ├── email.service.js      # Email sending
│   └── unitOfWork.service.js # Database transactions
├── utils/               # Utility classes & helpers
│   ├── apiFeatures.js        # Filter, sort, search, paginate
│   ├── appError.js           # Custom error class
│   ├── generateJWT.js        # JWT generation
│   ├── handlerFactory.js     # CRUD factory functions
│   └── httpStatusText.js     # Status text constants
├── routes/              # API routes aggregator
├── app.js               # Express app configuration
└── server.js            # Server entry point
```

## ✨ Features (Planned)

- [x] Project Architecture & Setup
- [ ] User Authentication (Register, Login, Email Verification)
- [ ] Password Reset Flow
- [ ] Multi-Role System (Customer, Seller, Admin)
- [ ] Product & Category Management
- [ ] Shopping Cart & Wishlist
- [ ] Order Management
- [ ] Stripe Payment Integration
- [ ] Reviews & Ratings
- [ ] Coupons & Discounts
- [ ] Multi-Vendor Support
- [ ] Admin Dashboard APIs
- [ ] Email Notifications

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email service)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/e-commerce-backend.git
   cd e-commerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   MONGO_URL=mongodb://localhost:27017/ecommerce
   JWT_SECRET_KEY=your-secret-key
   JWT_EXPIRES_IN=7d
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   EMAIL_FROM=noreply@ecommerce.com
   ```

4. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📡 API Endpoints (Coming Soon)

API endpoints will be documented as features are implemented.

## 🧪 Testing

Use **Thunder Client** (VS Code extension) or **Postman** to test the API.

## 📄 License

MIT

## 👤 Author

Built with ❤️ as part of MEAN Stack learning journey.