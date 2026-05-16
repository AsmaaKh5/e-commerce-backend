import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import api, { swrFetcher, getErrorMessage } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';

export default function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (router.query.category) setBrand('');
  }, [router.query.category]);

  const query = new URLSearchParams({ page, limit: 12 });
  if (router.query.category) query.set('category', router.query.category);
  if (search) query.set('search', search);
  if (brand) query.set('brand', brand);
  if (sort) query.set('sort', sort);

  const { data, error, isLoading } = useSWR(`/products?${query}`, swrFetcher);
  const { data: brandsData } = useSWR('/brands', swrFetcher);
  const { data: wishlistData, mutate: mutateWishlist } = useSWR(
    isAuthenticated ? '/wishlist' : null,
    swrFetcher
  );

  const products = data?.data?.products || [];
  const pagination = data?.pagination;
  const brands = brandsData?.data?.brands || [];
  const wishlistIds = (wishlistData?.data?.wishlist || []).map((item) =>
    (item.product?._id || item.product)?.toString()
  );

  const addToCart = async (product) => {
    if (!isAuthenticated) return router.push('/login');
    try {
      await api.post('/cart/items', { productId: product._id, quantity: 1 });
      toast.success('تمت الإضافة للسلة');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) return router.push('/login');
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
    <section className="container-app py-10">
      <header className="mb-8">
        <p className="section-label">المتجر</p>
        <h1 className="page-title">كل المنتجات</h1>
      </header>

      <form
        className="card mb-8 grid gap-4 p-4 md:grid-cols-4"
        onSubmit={(e) => { e.preventDefault(); setPage(1); }}
      >
        <input
          className="input-field md:col-span-2"
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input-field" value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1); }}>
          <option value="">كل العلامات</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <select className="input-field" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="">الترتيب</option>
          <option value="price">السعر: من الأقل</option>
          <option value="-price">السعر: من الأعلى</option>
          <option value="-createdAt">الأحدث</option>
        </select>
      </form>

      {isLoading && (
  <div className="flex justify-center py-16">
    <Spinner />
  </div>
)}      {error && <p className="text-center text-red-600">فشل تحميل المنتجات</p>}

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            isWishlisted={wishlistIds.includes(product._id)}
          />
        ))}
      </section>

      {pagination && (
        <nav className="mt-10 flex items-center justify-center gap-3">
          <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            السابق
          </button>
          <span className="text-sm text-slate-600">
            صفحة {pagination.currentPage || page} من {pagination.totalPages}
          </span>
          <button
            type="button"
            className="btn-secondary"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            التالي
          </button>
        </nav>
      )}
    </section>
  );
}
