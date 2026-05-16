import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import api, { swrFetcher, getErrorMessage } from '../lib/api';
import { AuthGate } from '../hooks/useRequireAuth';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

const TABS = [
  { id: 'profile', label: 'البيانات' },
  { id: 'addresses', label: 'العناوين' },
  { id: 'password', label: 'كلمة المرور' },
  { id: 'danger', label: 'الحساب' },
];

function ProfileContent() {
  const [tab, setTab] = useState('profile');
  const { logout, loadUser } = useAuth();
  const router = useRouter();
  const { data, mutate, isLoading } = useSWR('/users/me', swrFetcher);
  const user = data?.data?.user;

  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [address, setAddress] = useState({ alias: 'المنزل', street: '', city: '', country: 'مصر', phone: '' });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/users/me', profile);
      toast.success('تم التحديث');
      mutate();
      loadUser();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/users/me/change-password', passwords);
      toast.success('تم تغيير كلمة المرور');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/me/addresses', address);
      toast.success('تمت إضافة العنوان');
      mutate();
      setAddress({ alias: 'المنزل', street: '', city: '', country: 'مصر', phone: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await api.delete(`/users/me/addresses/${addressId}`);
      toast.info('تم الحذف');
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const deleteAccount = async () => {
    if (!confirm('حذف الحساب نهائياً؟')) return;
    try {
      await api.delete('/users/me');
      logout();
      router.push('/');
      toast.info('تم حذف الحساب');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) return <p className="flex justify-center py-12"><Spinner /></p>;

  return (
    <section className="grid gap-8 lg:grid-cols-4">
      <nav className="flex flex-wrap gap-2 lg:flex-col">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <section className="card p-6 lg:col-span-3">
        {tab === 'profile' && (
          <form className="space-y-4" onSubmit={saveProfile}>
            <h2 className="text-lg font-bold">البيانات الشخصية</h2>
            <p className="text-sm text-slate-500">البريد: {user?.email}</p>
            <p className="text-sm text-slate-500">الدور: {user?.role}</p>
            <input className="input-field" placeholder="الاسم الأول" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
            <input className="input-field" placeholder="اسم العائلة" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
            <input className="input-field" placeholder="الهاتف" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <button type="submit" className="btn-primary">حفظ</button>
          </form>
        )}

        {tab === 'addresses' && (
          <section className="space-y-6">
            <h2 className="text-lg font-bold">العناوين</h2>
            <ul className="space-y-3">
              {(user?.addresses || []).map((addr) => (
                <li key={addr._id} className="flex items-start justify-between rounded-xl border border-surface-border p-4">
                  <span className="text-sm">
                    <strong>{addr.alias}</strong> — {addr.street}, {addr.city}, {addr.country}
                  </span>
                  <button type="button" className="text-sm text-red-600" onClick={() => deleteAddress(addr._id)}>حذف</button>
                </li>
              ))}
            </ul>
            <form className="space-y-3 border-t border-surface-border pt-6" onSubmit={addAddress}>
              <h3 className="font-semibold">إضافة عنوان</h3>
              <input className="input-field" placeholder="التسمية" value={address.alias} onChange={(e) => setAddress({ ...address, alias: e.target.value })} />
              <input className="input-field" placeholder="الشارع" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
              <input className="input-field" placeholder="المدينة" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
              <input className="input-field" placeholder="الدولة" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
              <button type="submit" className="btn-primary">إضافة</button>
            </form>
          </section>
        )}

        {tab === 'password' && (
          <form className="space-y-4" onSubmit={changePassword}>
            <h2 className="text-lg font-bold">تغيير كلمة المرور</h2>
            <input type="password" className="input-field" placeholder="كلمة المرور الحالية" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
            <input type="password" className="input-field" placeholder="كلمة المرور الجديدة" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required />
            <button type="submit" className="btn-primary">تحديث</button>
          </form>
        )}

        {tab === 'danger' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-red-700">منطقة الخطر</h2>
            <button type="button" className="btn-danger" onClick={deleteAccount}>حذف الحساب</button>
            <button type="button" className="btn-secondary block" onClick={() => { logout(); router.push('/login'); }}>تسجيل الخروج</button>
          </section>
        )}
      </section>
    </section>
  );
}

export default function Profile() {
  return (
    <section className="container-app py-10">
      <h1 className="page-title mb-8">حسابي</h1>
      <AuthGate>
        <ProfileContent />
      </AuthGate>
    </section>
  );
}
