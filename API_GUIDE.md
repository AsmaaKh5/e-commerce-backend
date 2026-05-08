# 📡 دليل استخدام الـ APIs

## 🌍 الخادم الأساسي
```
http://localhost:3002/api/v1
```

---

## 🔐 المصادقة (Authentication)

### 1. إنشاء حساب جديد
```
POST /auth/register
Content-Type: application/json

{
  "firstName": "أحمد",
  "lastName": "علي",
  "email": "ahmed@example.com",
  "password": "Test@123456",
  "phone": "+201234567890"
}

Response:
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "أحمد",
      "lastName": "علي",
      "email": "ahmed@example.com",
      "phone": "+201234567890"
    }
  }
}
```

### 2. تسجيل الدخول
```
POST /auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "Test@123456"
}

Response:
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {...}
  }
}
```

### 3. التحقق من البريد الإلكتروني
```
POST /auth/verify-email
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "verificationCode": "123456"
}
```

### 4. نسيان كلمة المرور
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "ahmed@example.com"
}
```

### 5. إعادة تعيين كلمة المرور
```
POST /auth/reset-password
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "resetCode": "123456",
  "newPassword": "NewTest@123456"
}
```

---

## 👤 المستخدمين (Users)

### الرؤوس المطلوبة:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### 1. الملف الشخصي
```
GET /users/me

Response:
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "أحمد",
      "lastName": "علي",
      "email": "ahmed@example.com",
      "phone": "+201234567890",
      "role": "customer",
      "addresses": []
    }
  }
}
```

### 2. تحديث الملف الشخصي
```
PATCH /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "محمد",
  "lastName": "أحمد",
  "phone": "+201234567891"
}

Response:
{
  "status": "success",
  "data": {
    "user": {...}
  }
}
```

### 3. تغيير كلمة المرور
```
PATCH /users/me/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "Test@123456",
  "password": "NewTest@123456",
  "passwordConfirm": "NewTest@123456"
}
```

### 4. حذف الحساب
```
DELETE /users/me
Authorization: Bearer {token}
```

### 5. إضافة عنوان
```
POST /users/me/addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "alias": "Home",
  "street": "123 Main Street",
  "city": "Cairo",
  "country": "Egypt",
  "postalCode": "12345",
  "phone": "+201234567890",
  "isDefault": true
}

Response:
{
  "status": "success",
  "data": {
    "user": {
      "addresses": [
        {
          "_id": "...",
          "alias": "Home",
          "street": "123 Main Street",
          ...
        }
      ]
    }
  }
}
```

### 6. تحديث عنوان
```
PATCH /users/me/addresses/:addressId
Authorization: Bearer {token}
Content-Type: application/json

{
  "street": "456 New Street",
  "city": "Alexandria"
}
```

### 7. حذف عنوان
```
DELETE /users/me/addresses/:addressId
Authorization: Bearer {token}
```

### 8. عرض جميع المستخدمين (Admin فقط)
```
GET /users
Authorization: Bearer {adminToken}
```

### 9. عرض مستخدم معين (Admin فقط)
```
GET /users/:userId
Authorization: Bearer {adminToken}
```

### 10. حظر مستخدم (Admin فقط)
```
PATCH /users/:userId/block
Authorization: Bearer {adminToken}
```

### 11. إلغاء حظر مستخدم (Admin فقط)
```
PATCH /users/:userId/unblock
Authorization: Bearer {adminToken}
```

---

## 🛍️ المنتجات (Products)

### 1. عرض جميع المنتجات
```
GET /products
GET /products?page=1&limit=10
GET /products?search=iPhone
GET /products?sort=price

Response:
{
  "status": "success",
  "results": 6,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalResults": 6
  },
  "data": {
    "products": [
      {
        "_id": "...",
        "name": "iPhone 15 Pro",
        "price": 999,
        "description": "Latest Apple smartphone",
        "brand": {...},
        "category": {...},
        "images": ["..."],
        "stock": 50,
        "ratingsAverage": 4.8,
        "ratingsQuantity": 245
      }
    ]
  }
}
```

### 2. عرض منتج واحد
```
GET /products/:productId

Response:
{
  "status": "success",
  "data": {
    "product": {...}
  }
}
```

### 3. إنشاء منتج (Admin فقط)
```
POST /products
Authorization: Bearer {adminToken}
Content-Type: multipart/form-data

form-data:
- name: "iPhone 15 Pro"
- price: 999
- description: "Latest Apple smartphone"
- brand: "{brandId}"
- category: "{categoryId}"
- stock: 50
- images: [file1, file2, ...]

Response:
{
  "status": "success",
  "data": {
    "product": {...}
  }
}
```

### 4. تحديث منتج (Admin فقط)
```
PATCH /products/:productId
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "price": 1099,
  "stock": 40
}
```

### 5. حذف منتج (Admin فقط)
```
DELETE /products/:productId
Authorization: Bearer {adminToken}
```

---

## 🏷️ التصنيفات (Categories)

### 1. عرض جميع التصنيفات
```
GET /categories

Response:
{
  "status": "success",
  "results": 4,
  "pagination": {...},
  "data": {
    "categories": [
      {
        "_id": "...",
        "name": "Electronics",
        "description": "Electronic devices",
        "slug": "electronics"
      }
    ]
  }
}
```

### 2. عرض تصنيف واحد
```
GET /categories/:categoryId
```

### 3. إنشاء تصنيف (Admin فقط)
```
POST /categories
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

### 4. تحديث تصنيف (Admin فقط)
```
PATCH /categories/:categoryId
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "Electronics Updated"
}
```

### 5. حذف تصنيف (Admin فقط)
```
DELETE /categories/:categoryId
Authorization: Bearer {adminToken}
```

---

## 🏢 الشركات (Brands)

### 1. عرض جميع الشركات
```
GET /brands

Response:
{
  "status": "success",
  "results": 4,
  "data": {
    "brands": [
      {
        "_id": "...",
        "name": "Apple",
        "description": "Premium tech products",
        "slug": "apple"
      }
    ]
  }
}
```

### 2. عرض شركة واحدة
```
GET /brands/:brandId
```

### 3. إنشاء شركة (Admin فقط)
```
POST /brands
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "Apple",
  "description": "Premium tech products"
}
```

### 4. تحديث شركة (Admin فقط)
```
PATCH /brands/:brandId
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "description": "Updated description"
}
```

### 5. حذف شركة (Admin فقط)
```
DELETE /brands/:brandId
Authorization: Bearer {adminToken}
```

---

## 🛒 السلة (Cart)

### 1. إضافة منتج للسلة
```
POST /cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "...",
  "quantity": 2
}

Response:
{
  "status": "success",
  "data": {
    "cart": {...}
  }
}
```

### 2. عرض السلة
```
GET /cart
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "...",
      "items": [
        {
          "productId": "...",
          "quantity": 2,
          "price": 999
        }
      ],
      "totalPrice": 1998,
      "user": "..."
    }
  }
}
```

### 3. تحديث كمية المنتج
```
PATCH /cart/items/:itemId
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

### 4. حذف منتج من السلة
```
DELETE /cart/items/:itemId
Authorization: Bearer {token}
```

---

## 📦 الطلبات (Orders)

### 1. إنشاء طلب
```
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "cartId": "...",
  "shippingAddress": {
    "alias": "Home",
    "street": "123 Main Street",
    "city": "Cairo",
    "country": "Egypt"
  },
  "paymentMethod": "card"
}

Response:
{
  "status": "success",
  "data": {
    "order": {
      "_id": "...",
      "user": "...",
      "items": [...],
      "totalPrice": 1998,
      "shippingAddress": {...},
      "paymentMethod": "card",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2. عرض طلباتي
```
GET /orders
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "data": {
    "orders": [...]
  }
}
```

### 3. عرض طلب معين
```
GET /orders/:orderId
Authorization: Bearer {token}
```

---

## 💳 الدفع (Payments)

### 1. إنشاء جلسة دفع Stripe
```
POST /payments/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "..."
}

Response:
{
  "status": "success",
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
}
```

---

## 📝 ملاحظات مهمة

### معايير الطلب (Requests)
1. جميع الطلبات يجب أن تحتوي على `Content-Type: application/json`
2. للعمليات التي تحتاج مصادقة، أضيف رأس `Authorization: Bearer {token}`
3. استخدم `_id` المرجعي من الاستجابات السابقة

### معايير الاستجابة (Responses)
1. جميع الاستجابات الناجحة ترجع `status: "success"`
2. جميع الأخطاء ترجع `status: "fail"`
3. الأخطاء تحتوي على `message` توضيحية

### الأخطاء الشائعة
- `401`: التوكن منتهي الصلاحية أو غير صحيح
- `403`: ليس لديك صلاحيات لهذه العملية
- `404`: المورد غير موجود
- `400`: البيانات المرسلة غير صحيحة
- `500`: خطأ في الخادم

---

## 🧪 اختبار الـ APIs

### استخدام Postman
1. ادخل الـ URL في شريط الطلب
2. اختر طريقة الطلب (GET, POST, PATCH, DELETE)
3. أضيف الرؤوس المطلوبة
4. أدخل JSON في Body
5. اضغط Send

### استخدام cURL
```bash
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@example.com","password":"Test@123456"}'
```

### استخدام JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3002/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    email: 'ahmed@example.com',
    password: 'Test@123456'
  })
});

const data = await response.json();
```

---

## 🔑 اختبارات سريعة

### 1. تسجيل + دخول
```bash
# التسجيل
curl -X POST http://localhost:3002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "password":"Test@123456",
    "phone":"+201234567890"
  }'

# الدخول
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@123456"
  }'
```

### 2. الملف الشخصي
```bash
curl -X GET http://localhost:3002/api/v1/users/me \
  -H "Authorization: Bearer {token}"
```

### 3. المنتجات
```bash
curl -X GET "http://localhost:3002/api/v1/products?page=1&limit=10"
```

---

**استمتع باستخدام الـ APIs! 🚀**