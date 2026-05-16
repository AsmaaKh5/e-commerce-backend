import useSWR from 'swr';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import api, { swrFetcher, getErrorMessage } from '../lib/api';
import { getImageUrl } from '../lib/images';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { AuthGate } from '../hooks/useRequireAuth';
import { FaShoppingCart } from 'react-icons/fa';

function CartContent() {
  const { data, mutate, isLoading } = useSWR('/cart', swrFetcher);
  const cart = data?.data?.cart;
  const items = cart?.items || [];

  const updateQty = async (itemId, quantity) => {
    try {
      await api.patch(`/cart/items/${itemId}`, { quantity });
      mutate();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      toast.info('تم الحذف');
      mutate();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const subtotal = items.reduce((sum, item) => {
    const p = item.product;
    return sum + (p?.price || 0) * item.quantity;
  }, 0);

  if (isLoading) {
    return <p className="flex justify-center py-20"><Spinner /></p>;
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={FaShoppingCart}
        title="سلتك فارغة"
        description="ابدأ بإضافة منتجات من المتجر"
        actionHref="/products"
        actionLabel="تصفح المنتجات"
      />
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-3">
      <ul className="space-y-4 lg:col-span-2">
        {items.map((item) => {
          const p = item.product;
          if (!p) return null;
          return (
            <li key={item._id} className="card flex flex-wrap items-center gap-4 p-4">
              <img src={getImageUrl(p.images?.[0])} alt={p.name} className="h-20 w-20 rounded-lg object-contain" />
              <section className="min-w-[140px] flex-1">
                <h3 className="font-semibold text-slate-900">{p.name}</h3>
                <p className="text-brand-700 font-bold">${p.price}</p>
              </section>
              <p className="flex items-center gap-2">
                <button type="button" className="rounded-lg bg-slate-100 p-2" onClick={() => updateQty(item._id, item.quantity - 1)}>
                  <FaMinus />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button type="button" className="rounded-lg bg-slate-100 p-2" onClick={() => updateQty(item._id, item.quantity + 1)}>
                  <FaPlus />
                </button>
              </p>
              <p className="font-bold">${(p.price * item.quantity).toFixed(2)}</p>
              <button type="button" className="text-red-500 hover:text-red-700" onClick={() => removeItem(item._id)}>
                <FaTrash />
              </button>
            </li>
          );
        })}
      </ul>

      <aside className="card h-fit p-6">
        <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>
        <p className="flex justify-between border-b border-surface-border py-3">
          <span>المجموع</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </p>
        <p className="mt-4 text-sm text-slate-500">
          إتمام الطلب عبر API الطلبات سيُضاف عند تفعيله في الباك إند.
        </p>
        <Link href="/products" className="btn-secondary mt-6 block w-full text-center">
          متابعة التسوق
        </Link>
      </aside>
    </section>
  );
}

export default function Cart() {
  return (
    <section className="container-app py-10">
      <h1 className="page-title mb-8">سلة التسوق</h1>
      <AuthGate>
        <CartContent />
      </AuthGate>
    </section>
  );
}
