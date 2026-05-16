import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../lib/api';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/register', data);
      toast.success('تم التسجيل! تحقق من بريدك لتفعيل الحساب');
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'الاسم الأول', type: 'text', rules: { required: 'مطلوب' } },
    { name: 'lastName', label: 'اسم العائلة', type: 'text', rules: { required: 'مطلوب' } },
    { name: 'email', label: 'البريد الإلكتروني', type: 'email', rules: { required: 'مطلوب' } },
    { name: 'password', label: 'كلمة المرور', type: 'password', rules: { required: 'مطلوب', minLength: { value: 6, message: '6 أحرف على الأقل' } } },
    { name: 'phone', label: 'الهاتف', type: 'tel', rules: {} },
  ];

  return (
    <section className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <form className="card w-full max-w-md space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
        <p className="section-label">انضم إلينا</p>
        <h1 className="page-title">إنشاء حساب</h1>

        {fields.map((f) => (
          <label key={f.name} className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</span>
            <input type={f.type} className="input-field" {...register(f.name, f.rules)} />
            {errors[f.name] && <p className="mt-1 text-sm text-red-600">{errors[f.name].message}</p>}
          </label>
        ))}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
        </button>

        <p className="text-center text-sm text-slate-600">
          لديك حساب؟ <Link href="/login" className="font-semibold text-brand-600 hover:underline">سجّل الدخول</Link>
        </p>
      </form>
    </section>
  );
}
