# E-Commerce Platform - اختبار شامل 🧪

## ⚠️ المتطلبات الأساسية
قبل البدء، تأكد من وجود:
- **MongoDB** - يعمل على `mongodb://localhost:27017`
- **Node.js** و **npm**

## 🚀 البدء السريع

### 1️⃣ تشغيل الباك اند
```bash
cd e-commerce-backend
npm install
npm run dev
```
✅ الباك اند سيعمل على: `http://localhost:3002`

### 2️⃣ تشغيل الفرونت اند
```bash
cd frontend
npm install
npm run dev
```
✅ الفرونت اند سيعمل على: `http://localhost:3000`

### 3️⃣ تحميل بيانات الاختبار
```bash
cd e-commerce-backend
npm run seed
```
هذا سيضيف:
- ✅ 4 شركات (Brands)
- ✅ 4 تصنيفات (Categories)
- ✅ 6 منتجات (Products)

---

## 🧪 الميزات المتوفرة للاختبار

### 1. المصادقة (Authentication)
- ✅ **تسجيل الدخول**: `/login`
- ✅ **إنشاء حساب**: `/register`
- ✅ **الملف الشخصي**: `/profile`

**اختبر:**
1. اذهب إلى http://localhost:3000/register
2. ملء البيانات:
   - الاسم الأول: Test
   - الاسم الأخير: User
   - البريد: test@example.com
   - كلمة المرور: Test@123456
   - الهاتف: +201234567890
3. سيتم تسجيلك تلقائياً

---

### 2. المنتجات (Products)
- ✅ **عرض المنتجات**: `/products`
- ✅ **تفاصيل المنتج**: `/products/[id]`
- ✅ **الفلترة والبحث**

**اختبر:**
1. اذهب إلى http://localhost:3000/products
2. ستجد 6 منتجات من خلال بيانات الـ seed
3. انقر على أي منتج للتفاصيل
4. استخدم "Add to Cart" لإضافة للسلة

---

### 3. التصنيفات (Categories)
- ✅ **عرض كل التصنيفات**: `/categories`

**اختبر:**
1. اذهب إلى http://localhost:3000/categories
2. ستجد 4 تصنيفات

---

### 4. السلة (Shopping Cart)
- ✅ **عرض السلة**: `/cart`
- ✅ **إضافة/حذف المنتجات**
- ✅ **تعديل الكمية**
- ✅ **الدفع**

**اختبر:**
1. أضف منتجات من `/products`
2. اذهب إلى `/cart`
3. عدّل الكميات
4. انقر Checkout

---

### 5. الملف الشخصي (Profile)
- ✅ **عرض البيانات**: `/profile`
- ✅ **تعديل الملف الشخصي**
- ✅ **تغيير كلمة المرور**
- ✅ **تسجيل الخروج**

**اختبر:**
1. اذهب إلى `/profile`
2. انقر "Edit Profile"
3. عدّل اسمك أو رقم الهاتف
4. انقر "Save Changes"

---

### 6. اختبار جميع APIs
- ✅ **صفحة اختبار شاملة**: `/api-test`

**اختبر:**
1. اذهب إلى http://localhost:3000/api-test
2. انقر "Run All Tests"
3. ستشاهد نتائج اختبار جميع الـ APIs:
   - ✅ Registration
   - ✅ Login
   - ✅ Get Profile
   - ✅ Update Profile
   - ✅ Get Products
   - ✅ Get Brands
   - ✅ Get Categories
   - ✅ Change Password
   - ✅ Add Address

---

## 📊 الـ APIs المتوفرة في الباك اند

### Auth APIs
```
POST   /api/v1/auth/register              - إنشاء حساب جديد
POST   /api/v1/auth/login                 - تسجيل الدخول
POST   /api/v1/auth/verify-email          - التحقق من البريد
POST   /api/v1/auth/forgot-password       - نسيان كلمة المرور
POST   /api/v1/auth/reset-password        - إعادة تعيين كلمة المرور
```

### Users APIs
```
GET    /api/v1/users/me                   - الملف الشخصي
PATCH  /api/v1/users/me                   - تحديث الملف الشخصي
DELETE /api/v1/users/me                   - حذف الحساب
PATCH  /api/v1/users/me/change-password   - تغيير كلمة المرور

POST   /api/v1/users/me/addresses         - إضافة عنوان
PATCH  /api/v1/users/me/addresses/:id     - تحديث عنوان
DELETE /api/v1/users/me/addresses/:id     - حذف عنوان

GET    /api/v1/users                      - عرض جميع المستخدمين (Admin)
GET    /api/v1/users/:id                  - عرض مستخدم (Admin)
PATCH  /api/v1/users/:id/block            - حظر مستخدم (Admin)
PATCH  /api/v1/users/:id/unblock          - إلغاء الحظر (Admin)
```

### Products APIs
```
GET    /api/v1/products                   - عرض جميع المنتجات
GET    /api/v1/products/:id               - عرض منتج واحد
POST   /api/v1/products                   - إنشاء منتج (Admin)
PATCH  /api/v1/products/:id               - تحديث منتج (Admin)
DELETE /api/v1/products/:id               - حذف منتج (Admin)
```

### Categories APIs
```
GET    /api/v1/categories                 - عرض جميع التصنيفات
GET    /api/v1/categories/:id             - عرض تصنيف واحد
POST   /api/v1/categories                 - إنشاء تصنيف (Admin)
PATCH  /api/v1/categories/:id             - تحديث تصنيف (Admin)
DELETE /api/v1/categories/:id             - حذف تصنيف (Admin)
```

### Brands APIs
```
GET    /api/v1/brands                     - عرض جميع الشركات
GET    /api/v1/brands/:id                 - عرض شركة واحدة
POST   /api/v1/brands                     - إنشاء شركة (Admin)
PATCH  /api/v1/brands/:id                 - تحديث شركة (Admin)
DELETE /api/v1/brands/:id                 - حذف شركة (Admin)
```

---

## 🧪 مثال كامل للاختبار

### 1. انشئ حساب جديد
```
الموقع: http://localhost:3000/register
البريد: test@example.com
كلمة المرور: Test@123456
```

### 2. سجل دخولك
```
الموقع: http://localhost:3000/login
استخدم نفس البيانات
```

### 3. تصفح المنتجات
```
الموقع: http://localhost:3000/products
ستظهر 6 منتجات
```

### 4. أضف منتجات للسلة
```
انقر "Add" على أي منتج
تحقق من السلة: http://localhost:3000/cart
```

### 5. أكمل الشراء
```
اذهب للسلة: http://localhost:3000/cart
انقر "Checkout"
```

### 6. عدّل ملفك الشخصي
```
الموقع: http://localhost:3000/profile
انقر "Edit Profile"
عدّل البيانات واحفظها
```

---

## 🔧 استكشاف الأخطاء

### مشكلة: "Cannot connect to server"
- تأكد من تشغيل الباك اند: `npm run dev`
- تحقق من المنفذ: 3002

### مشكلة: "صفحة بيضاء"
- افتح Developer Console (F12)
- تحقق من الأخطاء
- تأكد من `.env.local` في الفرونت

### مشكلة: "No products found"
- شغّل: `npm run seed` في مجلد الباك اند
- أعد تحميل الصفحة

---

## 📝 ملاحظات مهمة

✅ **جميع الميزات تم اختبارها**
✅ **البيانات الاختبارية متوفرة عبر seed**
✅ **السلة تعمل مع localStorage**
✅ **المصادقة تعمل مع JWT**

---

## 📱 الصفحات المتاحة

| الصفحة | الرابط | الوصف |
|-------|-------|-------|
| الرئيسية | `/` | صفحة الترحيب |
| المنتجات | `/products` | عرض جميع المنتجات |
| تفاصيل المنتج | `/products/[id]` | تفاصيل منتج واحد |
| التصنيفات | `/categories` | عرض التصنيفات |
| السلة | `/cart` | السلة والدفع |
| الملف الشخصي | `/profile` | البيانات الشخصية |
| تسجيل الدخول | `/login` | صفحة الدخول |
| إنشاء حساب | `/register` | صفحة التسجيل |
| اختبار APIs | `/api-test` | اختبار جميع الـ APIs |

---

**استمتع بالاختبار! 🎉**