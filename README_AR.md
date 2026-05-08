# 🛍️ E-Commerce Platform - مشروع متكامل

تطبيق متجر إلكتروني متكامل بـ Next.js و Node.js

## 🌟 الميزات الرئيسية

- ✅ نظام مصادقة آمن (JWT)
- ✅ إدارة المنتجات والتصنيفات
- ✅ سلة تسوق عاملة
- ✅ نظام الطلبات
- ✅ ملف شخصي للمستخدم
- ✅ لوحة إدارة الـ APIs
- ✅ بيانات اختبارية جاهزة

## 🚀 البدء السريع

### 1. تثبيت المتطلبات
```bash
# الفرونت اند
cd frontend
npm install

# الباك اند
cd ..
npm install
```

### 2. تشغيل الخادمين
```bash
# الفرونت اند (terminal 1)
cd frontend
npm run dev
# http://localhost:3000

# الباك اند (terminal 2)
npm run dev
# http://localhost:3002
```

### 3. تحميل البيانات الاختبارية
```bash
npm run seed
```

## 📖 التوثيق

| الملف | الوصف |
|------|--------|
| [QUICK_START.md](QUICK_START.md) | البدء السريع والاختبار |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | دليل الاختبار الشامل |
| [API_GUIDE.md](API_GUIDE.md) | دليل الـ APIs |
| [TEST_RESULTS.md](TEST_RESULTS.md) | نتائج الاختبار |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | ملخص المشروع |

## 🌐 الروابط المهمة

- **الفرونت اند**: http://localhost:3000
- **الباك اند API**: http://localhost:3002/api/v1
- **اختبار الـ APIs**: http://localhost:3000/api-test

## 📱 الصفحات الرئيسية

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | / |
| المنتجات | /products |
| المنتج | /products/[id] |
| التصنيفات | /categories |
| السلة | /cart |
| الملف الشخصي | /profile |
| التسجيل | /register |
| الدخول | /login |

## 🧪 الاختبار

### سيناريو كامل
1. تسجيل حساب جديد
2. تصفح المنتجات
3. إضافة للسلة
4. عرض السلة
5. إكمال الطلب
6. عرض الملف الشخصي

### اختبار الـ APIs
```
http://localhost:3000/api-test
```

## 📊 الإحصائيات

- **30+** API endpoint
- **8** صفحات
- **6** منتجات جاهزة
- **4** تصنيفات
- **4** شركات

## 🔧 التكنولوجيا

### Frontend
- React 18.2
- Next.js 13.5
- Tailwind CSS
- Axios
- SWR

### Backend
- Node.js
- Express
- MongoDB
- JWT
- Mongoose

## 📝 ملاحظات

- ✅ جميع الميزات مختبرة
- ✅ جميع الـ APIs تعمل
- ✅ البيانات الاختبارية متوفرة
- ✅ جاهز للإنتاج

## 🆘 استكشاف الأخطاء

### المشكلة: صفحة بيضاء
**الحل**: افتح Console (F12) وتحقق من الأخطاء

### المشكلة: لا تظهر المنتجات
**الحل**: شغّل `npm run seed`

### المشكلة: الخادم لا يستجيب
**الحل**: أعد تشغيل الخادم `npm run dev`

## 📞 المزيد من المعلومات

راجع الملفات التالية:
- QUICK_START.md للبدء السريع
- API_GUIDE.md لتفاصيل الـ APIs
- TESTING_GUIDE.md لاختبار شامل

---

**استمتع بالمشروع! 🚀**