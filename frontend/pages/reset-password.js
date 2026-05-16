import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../lib/api';
import Cookies from 'js-cookie';

export default function ResetPassword() {
  const router = useRouter();
  const email = router.query.email || '';
  const [step, setStep] = useState(router.query.step === 'verify' ? 'verify' : 'reset');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-reset-code', { resetCode });
      toast.success(data.message || 'تم التحقق');
      setStep('reset');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { email, newPassword });
      if (data.token) Cookies.set('token', data.token, { expires: 7 });
      toast.success(data.message || 'تم تغيير كلمة المرور');
      router.push('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-app flex min-h-[60vh] items-center justify-center py-12">
      {step === 'verify' ? (
        <form className="card w-full max-w-md space-y-4 p-8" onSubmit={verifyCode}>
          <h1 className="page-title">التحقق من الرمز</h1>
          <input
            className="input-field text-center tracking-widest"
            maxLength={6}
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">تحقق</button>
        </form>
      ) : (
        <form className="card w-full max-w-md space-y-4 p-8" onSubmit={reset}>
          <h1 className="page-title">كلمة مرور جديدة</h1>
          <input
            type="password"
            className="input-field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">حفظ</button>
        </form>
      )}
      <Link href="/login" className="mt-4 block text-center text-sm text-brand-600">العودة للدخول</Link>
    </section>
  );
}
