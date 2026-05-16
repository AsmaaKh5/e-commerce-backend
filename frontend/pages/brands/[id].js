import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import api, { swrFetcher, getErrorMessage } from '../../lib/api';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function BrandDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAdmin } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(id ? `/brands/${id}` : null, swrFetcher);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const brand = data?.data?.brand;

  const startEdit = () => {
    setForm({ name: brand?.name || '', description: brand?.description || '' });
    setEditMode(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/brands/${id}`, form);
      toast.success('تم التحديث');
      setEditMode(false);
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const remove = async () => {
    if (!confirm('حذف هذه العلامة؟')) return;
    try {
      await api.delete(`/brands/${id}`);
      toast.success('تم الحذف');
      router.push('/brands');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) return <p className="container-app flex justify-center py-20"><Spinner /></p>;
  if (error || !brand) return <p className="container-app py-20 text-center">العلامة غير موجودة</p>;

  return (
    <section className="container-app max-w-2xl py-10">
      {editMode ? (
        <form className="card space-y-4 p-8" onSubmit={save}>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <textarea className="input-field min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <p className="flex gap-3">
            <button type="submit" className="btn-primary">حفظ</button>
            <button type="button" className="btn-secondary" onClick={() => setEditMode(false)}>إلغاء</button>
          </p>
        </form>
      ) : (
        <article className="card p-8">
          <h1 className="page-title">{brand.name}</h1>
          <p className="mt-4 text-slate-600">{brand.description}</p>
          {isAdmin && (
            <p className="mt-6 flex gap-3">
              <button type="button" className="btn-secondary" onClick={startEdit}>تعديل</button>
              <button type="button" className="btn-danger" onClick={remove}>حذف</button>
            </p>
          )}
        </article>
      )}
    </section>
  );
}
