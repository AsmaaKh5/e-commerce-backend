import useSWR from 'swr';
import Link from 'next/link';
import { swrFetcher } from '../../lib/api';
import Spinner from '../../components/ui/Spinner';

export default function Brands() {
  const { data, error, isLoading } = useSWR('/brands', swrFetcher);
  const brands = data?.data?.brands || [];

  return (
    <section className="container-app py-10">
      <header className="mb-8">
        <p className="section-label">العلامات</p>
        <h1 className="page-title">العلامات التجارية</h1>
      </header>

      {isLoading && <p className="flex justify-center py-16"><Spinner /></p>}
      {error && <p className="text-center text-red-600">فشل التحميل</p>}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link key={brand._id} href={`/brands/${brand._id}`} className="card-hover block p-6">
            <h2 className="text-xl font-bold text-slate-900">{brand.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{brand.description || ''}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-600">عرض التفاصيل ←</span>
          </Link>
        ))}
      </section>
    </section>
  );
}
