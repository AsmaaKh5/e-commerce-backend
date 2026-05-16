import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const redirect = router.query.redirect || '/';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('تم تسجيل الدخول بنجاح');
      router.push(redirect);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <form className="card w-full max-w-md space-y-5 p-8 animate-slide-up" onSubmit={handleSubmit(onSubmit)}>
        <p className="section-label">مرحباً بعودتك</p>
        <h1 className="page-title">تسجيل الدخول</h1>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">البريد الإلكتروني</span>
          <input type="email" className="input-field" {...register('email', { required: 'البريد مطلوب' })} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">كلمة المرور</span>
          <input type="password" className="input-field" {...register('password', { required: 'كلمة المرور مطلوبة' })} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </label>

        <p className="flex flex-wrap justify-between gap-2 text-sm">
          <Link href="/forgot-password" className="text-brand-600 hover:underline">نسيت كلمة المرور؟</Link>
          <Link href="/verify-email" className="text-slate-500 hover:underline">تفعيل البريد</Link>
        </p>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>

        <p className="text-center text-sm text-slate-600">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">سجّل الآن</Link>
        </p>
      </form>
    </section>
  );
}
