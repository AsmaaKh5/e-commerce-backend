import Link from 'next/link';
import { FaStore } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-surface-border bg-slate-900 text-slate-300">
      <div className="container-app grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2 font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
              <FaStore />
            </span>
            ShopHub
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            متجرك الإلكتروني الحديث — منتجات مختارة، تجربة شراء سلسة، ودعم كامل لكل مزايا المنصة.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-white">المنتجات</Link></li>
            <li><Link href="/brands" className="hover:text-white">العلامات التجارية</Link></li>
            <li><Link href="/categories" className="hover:text-white">التصنيفات</Link></li>
            <li><Link href="/wishlist" className="hover:text-white">المفضلة</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">الحساب</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/login" className="hover:text-white">تسجيل الدخول</Link></li>
            <li><Link href="/register" className="hover:text-white">إنشاء حساب</Link></li>
            <li><Link href="/profile" className="hover:text-white">الملف الشخصي</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ShopHub. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
