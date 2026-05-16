import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import api, { swrFetcher, getErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';

export default function AdminPanel() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('users');
  const { data: usersData, mutate: mutateUsers } = useSWR(isAdmin ? '/users' : null, swrFetcher);
  const { data: brandsData, mutate: mutateBrands } = useSWR('/brands', swrFetcher);
  const { data: categoriesData, mutate: mutateCategories } = useSWR('/categories', swrFetcher);
  const [newBrand, setNewBrand] = useState({ name: '', description: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  if (!authLoading && !isAdmin) {
    if (typeof window !== 'undefined') router.replace('/');
    return null;
  }

  if (authLoading) {
    return <p className="container-app flex justify-center py-20"><Spinner /></p>;
  }

  const users = usersData?.data?.users || [];
  const brands = brandsData?.data?.brands || [];
  const categories = categoriesData?.data?.categories || [];

  const blockUser = async (id, block) => {
    try {
      await api.patch(`/users/${id}/${block ? 'block' : 'unblock'}`);
      toast.success(block ? 'تم الحظر' : 'تم إلغاء الحظر');
      mutateUsers();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const createBrand = async (e) => {
    e.preventDefault();
    try {
      await api.post('/brands', newBrand);
      toast.success('تم إنشاء العلامة');
      setNewBrand({ name: '', description: '' });
      mutateBrands();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', newCategory);
      toast.success('تم إنشاء التصنيف');
      setNewCategory({ name: '', description: '' });
      mutateCategories();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <section className="container-app py-10">
      <header className="mb-8">
        <p className="section-label">إدارة</p>
        <h1 className="page-title">لوحة الإدارة</h1>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {['users', 'brands', 'categories'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${tab === t ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`}
          >
            {t === 'users' ? 'المستخدمون' : t === 'brands' ? 'العلامات' : 'التصنيفات'}
          </button>
        ))}
      </nav>

      {tab === 'users' && (
        <section className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50 text-start">
                <th className="p-3">الاسم</th>
                <th className="p-3">البريد</th>
                <th className="p-3">الدور</th>
                <th className="p-3">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-surface-border">
                  <td className="p-3">{u.firstName} {u.lastName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    <button type="button" className="text-amber-700 hover:underline" onClick={() => blockUser(u._id, !u.isBlocked)}>
                      {u.isBlocked ? 'إلغاء الحظر' : 'حظر'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'brands' && (
        <section className="grid gap-8 lg:grid-cols-2">
          <form className="card space-y-3 p-6" onSubmit={createBrand}>
            <h2 className="font-bold">علامة جديدة</h2>
            <input className="input-field" placeholder="الاسم" value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} required />
            <textarea className="input-field" placeholder="الوصف" value={newBrand.description} onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })} />
            <button type="submit" className="btn-primary">إضافة</button>
          </form>
          <ul className="card divide-y divide-surface-border p-4">
            {brands.map((b) => (
              <li key={b._id} className="py-3 font-medium">{b.name}</li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'categories' && (
        <section className="grid gap-8 lg:grid-cols-2">
          <form className="card space-y-3 p-6" onSubmit={createCategory}>
            <h2 className="font-bold">تصنيف جديد</h2>
            <input className="input-field" placeholder="الاسم" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} required />
            <textarea className="input-field" placeholder="الوصف" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />
            <button type="submit" className="btn-primary">إضافة</button>
          </form>
          <ul className="card divide-y divide-surface-border p-4">
            {categories.map((c) => (
              <li key={c._id} className="py-3 font-medium">{c.name}</li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
