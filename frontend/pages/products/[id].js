import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import api, { swrFetcher, getErrorMessage } from '../../lib/api';
import { getImageUrl } from '../../lib/images';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const { data, error, isLoading } = useSWR(id ? `/products/${id}` : null, swrFetcher);
  const { data: wishlistData, mutate } = useSWR(isAuthenticated ? '/wishlist' : null, swrFetcher);

  if (isLoading) return <p className="container-app flex justify-center py-20"><Spinner /></p>;
  if (error || !data) return <p className="container-app py-20 text-center text-red-600">المنتج غير موجود</p>;

  const product = data.data.product;
  const inWishlist = (wishlistData?.data?.wishlist || []).some(
    (w) => (w.product?._id || w.product)?.toString() === product._id
  );

  const addToCart = async () => {
    if (!isAuthenticated) return router.push('/login');
    try {
      await api.post('/cart/items', { productId: product._id, quantity });
      toast.success('تمت الإضافة للسلة');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) return router.push('/login');
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${product._id}`);
        toast.info('تمت الإزالة من المفضلة');
      } else {
        await api.post('/wishlist', { productId: product._id });
        toast.success('تمت الإضافة للمفضلة');
      }
      mutate();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <section className="container-app grid gap-10 py-10 lg:grid-cols-2">
      <figure className="card overflow-hidden p-6">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          className="mx-auto max-h-[420px] w-full object-contain"
        />
      </figure>
      <article>
        {product.brand?.name && (
          <p className="section-label">{product.brand.name}</p>
        )}
        <h1 className="page-title">{product.name}</h1>
        <p className="mt-2 text-3xl font-bold text-brand-700">${product.price}</p>
        <p className="mt-4 leading-relaxed text-slate-600">{product.description}</p>
        <p className="mt-2 text-sm text-slate-500">المخزون: {product.stock ?? 0}</p>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">الكمية</span>
          <input
            type="number"
            min={1}
            max={product.stock || 99}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="input-field mt-1 w-24"
          />
        </label>

        <p className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={addToCart} className="btn-primary">
            أضف للسلة
          </button>
          <button type="button" onClick={toggleWishlist} className="btn-secondary">
            {inWishlist ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
          </button>
        </p>
      </article>
    </section>
  );
}
