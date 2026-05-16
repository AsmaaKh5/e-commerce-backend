import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message || 'تم إرسال رمز الاستعادة');
      router.push(`/reset-password?email=${encodeURIComponent(email)}&step=verify`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-app flex min-h-[60vh] items-center justify-center py-12">
      <form className="card w-full max-w-md space-y-4 p-8" onSubmit={submit}>
        <h1 className="page-title">استعادة كلمة المرور</h1>
        <p className="text-sm text-slate-500">سنرسل رمزاً إلى بريدك الإلكتروني</p>
        <input
          type="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
        </button>
        <Link href="/login" className="block text-center text-sm text-brand-600">العودة للدخول</Link>
      </form>
    </section>
  );
}
