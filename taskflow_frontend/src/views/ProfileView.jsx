import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfileView() {
  const { profile, isLoading, saveProfile, updatePassword } = useProfile();

  const [username, setUsername]         = useState('');
  const [email, setEmail]               = useState('');
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [oldPassword, setOldPassword]   = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError]     = useState('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setEmail(profile.email || '');
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    await saveProfile({ username, email, first_name: firstName, last_name: lastName });
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmPassword) { setPasswordError('New passwords do not match.'); return; }
    const ok = await updatePassword({ old_password: oldPassword, new_password: newPassword });
    if (ok) { setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }
  }

  const fieldClass = 'w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition';
  const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-8 pt-12 pb-24">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-on-surface mb-2">Profile</h1>
          <p className="text-on-surface-variant font-medium opacity-70">Manage your account settings.</p>
        </header>

        {isLoading ? (
          <div className="max-w-2xl space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-12 bg-surface-container-lowest rounded-xl animate-pulse border border-outline-variant/10" />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl space-y-6">
            {/* Personal Information */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
              <h2 className="text-base font-black tracking-tight text-on-surface mb-6">Personal Information</h2>
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={fieldClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={fieldClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Username <span className="text-error">*</span></label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold px-6 py-2.5 rounded-xl active:scale-95 transition-transform">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
              <h2 className="text-base font-black tracking-tight text-on-surface mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={fieldClass} />
                  {passwordError && <p className="text-error text-xs mt-1">{passwordError}</p>}
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold px-6 py-2.5 rounded-xl active:scale-95 transition-transform">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
