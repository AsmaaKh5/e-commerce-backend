import useSWR from 'swr';
import Link from 'next/link';
import { swrFetcher } from '../lib/api';
import Spinner from '../components/ui/Spinner';

export default function Categories() {
  const { data, error, isLoading } = useSWR('/categories', swrFetcher);
  const categories = data?.data?.categories || [];

  return (
    <section className="container-app py-10">
      <header className="mb-8">
        <p className="section-label">تصفح</p>
        <h1 className="page-title">التصنيفات</h1>
      </header>

      {isLoading && <p className="flex justify-center py-16"><Spinner /></p>}
      {error && <p className="text-center text-red-600">فشل تحميل التصنيفات</p>}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <article key={cat._id} className="card-hover p-6">
            <h2 className="text-xl font-bold text-slate-900">{cat.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{cat.description || 'لا يوجد وصف'}</p>
            <Link
              href={`/products?category=${cat._id}`}
              className="btn-primary mt-4 inline-flex text-sm"
            >
              عرض المنتجات
            </Link>
          </article>
        ))}
      </section>

      {!isLoading && !categories.length && (
        <p className="text-center text-slate-500">لا توجد تصنيفات حالياً</p>
      )}
    </section>
  );
}
