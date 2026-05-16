import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../lib/api';
import Cookies from 'js-cookie';

export default function VerifyEmail() {
  const router = useRouter();
  const email = router.query.email || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-email', { code });
      if (data.token) Cookies.set('token', data.token, { expires: 7 });
      toast.success(data.message || 'تم التفعيل');
      router.push('/login');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) {
      toast.warning('أدخل بريدك في صفحة التسجيل أولاً');
      return;
    }
    try {
      const { data } = await api.post('/auth/resend-verification', { email });
      toast.success(data.message || 'تم إرسال الرمز');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <section className="container-app flex min-h-[60vh] items-center justify-center py-12">
      <form className="card w-full max-w-md space-y-4 p-8" onSubmit={verify}>
        <h1 className="page-title">تفعيل البريد</h1>
        <p className="text-sm text-slate-500">أدخل الرمز المكوّن من 6 أرقام المرسل إلى بريدك</p>
        {email && <p className="text-sm font-medium text-brand-700">{email}</p>}
        <input
          className="input-field text-center tracking-widest"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'جاري التحقق...' : 'تفعيل'}
        </button>
        <button type="button" onClick={resend} className="btn-secondary w-full">
          إعادة إرسال الرمز
        </button>
        <Link href="/login" className="block text-center text-sm text-brand-600">العودة لتسجيل الدخول</Link>
      </form>
    </section>
  );
}
