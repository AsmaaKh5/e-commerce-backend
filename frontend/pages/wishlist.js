import useSWR from 'swr';
import { toast } from 'react-toastify';
import { FaHeart } from 'react-icons/fa';
import api, { swrFetcher, getErrorMessage } from '../lib/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { AuthGate } from '../hooks/useRequireAuth';

function WishlistContent() {
  const { data, mutate, isLoading } = useSWR('/wishlist', swrFetcher);
  const items = data?.data?.wishlist || [];
  const products = items.map((i) => i.product).filter(Boolean);

  const remove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      toast.info('تمت الإزالة');
      mutate();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const addToCart = async (product) => {
    try {
      await api.post('/cart/items', { productId: product._id, quantity: 1 });
      toast.success('تمت الإضافة للسلة');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  if (isLoading) return <p className="flex justify-center py-20"><Spinner /></p>;
  if (!products.length) {
    return (
      <EmptyState
        icon={FaHeart}
        title="المفضلة فارغة"
        description="احفظ المنتجات التي تعجبك هنا"
        actionHref="/products"
        actionLabel="تصفح المنتجات"
      />
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={addToCart}
          onToggleWishlist={() => remove(product._id)}
          isWishlisted
        />
      ))}
    </section>
  );
}

export default function Wishlist() {
  return (
    <section className="container-app py-10">
      <h1 className="page-title mb-8">المفضلة</h1>
      <AuthGate>
        <WishlistContent />
      </AuthGate>
    </section>
  );
}
