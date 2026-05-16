import Link from 'next/link';
import useSWR from 'swr';
import { FaShoppingBag, FaShieldAlt, FaTruck, FaStar, FaArrowLeft } from 'react-icons/fa';
import { swrFetcher } from '../lib/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../lib/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: productsData, isLoading: productsLoading } = useSWR('/products?limit=8', swrFetcher);
  const { data: brandsData } = useSWR('/brands?limit=6', swrFetcher);
  const { data: wishlistData, mutate: mutateWishlist } = useSWR(
    isAuthenticated ? '/wishlist' : null,
    swrFetcher
  );

  const products = productsData?.data?.products || [];
  const brands = brandsData?.data?.brands || [];
  const wishlistIds = (wishlistData?.data?.wishlist || []).map((item) =>
    (item.product?._id || item.product)?.toString()
  );

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      await api.post('/cart/items', { productId: product._id, quantity: 1 });
      toast.success('تمت الإضافة للسلة');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      if (wishlistIds.includes(product._id)) {
        await api.delete(`/wishlist/${product._id}`);
        toast.info('تمت الإزالة من المفضلة');
      } else {
        await api.post('/wishlist', { productId: product._id });
        toast.success('تمت الإضافة للمفضلة');
      }
      mutateWishlist();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-700 via-brand-600 to-indigo-700 text-white">
        <div className="container-app relative py-20 md:py-28">
          <p className="section-label mb-3 text-brand-200">تسوق بذكاء</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            اكتشف منتجات مميزة بأسعار لا تُقاوم
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100">
            منصة ShopHub تربطك مباشرة بكل مزايا المتجر — منتجات، علامات، مفضلة، وسلة حقيقية من الـ API.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn bg-white text-brand-700 hover:bg-brand-50">
              تصفح المنتجات <FaArrowLeft className="text-sm" />
            </Link>
            <Link href="/register" className="btn border border-white/40 text-white hover:bg-white/10">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>

      <section className="container-app -mt-10 grid gap-4 md:grid-cols-3">
        {[
          { icon: FaShoppingBag, title: 'تشكيلة واسعة', desc: 'آلاف المنتجات من علامات موثوقة', iconClass: 'text-brand-600' },
          { icon: FaShieldAlt, title: 'شراء آمن', desc: 'حساب محمي ومصادقة كاملة', iconClass: 'text-emerald-600' },
          { icon: FaTruck, title: 'توصيل سريع', desc: 'عناوين متعددة وإدارة سهلة', iconClass: 'text-violet-600' },
        ].map(({ icon: Icon, title, desc, iconClass }) => (
          <div key={title} className="card p-6">
            <Icon className={`mb-3 text-2xl ${iconClass}`} />
            <h3 className="font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </div>
        ))}
      </section>

      {brands.length > 0 && (
        <section className="container-app py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-label">العلامات</p>
              <h2 className="page-title">أشهر العلامات التجارية</h2>
            </div>
            <Link href="/brands" className="text-sm font-semibold text-brand-600 hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="rounded-full border border-surface-border bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="container-app">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-label">منتجات مميزة</p>
              <h2 className="page-title">الأكثر طلباً</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-600 hover:underline">
              كل المنتجات
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlistIds.includes(product._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-900 py-14 text-white">
        <div className="container-app grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            { n: '10K+', l: 'عملاء سعداء' },
            { n: products.length ? `${products.length}+` : '50+', l: 'منتجات' },
            { n: brands.length ? `${brands.length}+` : '20+', l: 'علامات' },
            { n: '4.8', l: 'تقييم', icon: FaStar },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold">{s.n}</div>
              <div className="mt-1 flex items-center justify-center gap-1 text-slate-400">
                {s.icon && <s.icon className="text-amber-400" />}
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
