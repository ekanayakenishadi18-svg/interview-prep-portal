import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({ name: user.name, targetRole: user.targetRole || '', bio: user.bio || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/auth/profile', profile);
      setUser(data.user);
      toast.success('Profile saved');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error('The new passwords don’t match');
    setSavingPassword(true);
    try {
      await api.put('/auth/password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="stack-lg narrow">
      <header>
        <h1>Your profile</h1>
        <p className="muted">
          {user.email}. Member since {formatDate(user.createdAt)}.
        </p>
      </header>

      <form className="panel stack" onSubmit={saveProfile}>
        <h2>Details</h2>
        <label className="field">
          <span>Full name</span>
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required maxLength={60} />
        </label>
        <label className="field">
          <span>Role you're preparing for</span>
          <input
            value={profile.targetRole}
            onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
            maxLength={80}
            placeholder="e.g. Software Engineer Intern"
          />
        </label>
        <label className="field">
          <span>Short bio</span>
          <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} maxLength={300} />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save profile'}</button>
        </div>
      </form>

      <form className="panel stack" onSubmit={savePassword}>
        <h2>Change password</h2>
        <label className="field">
          <span>Current password</span>
          <input type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
        </label>
        <label className="field">
          <span>New password</span>
          <input type="password" autoComplete="new-password" minLength={6} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required />
        </label>
        <label className="field">
          <span>Confirm new password</span>
          <input type="password" autoComplete="new-password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" disabled={savingPassword}>{savingPassword ? 'Updating…' : 'Update password'}</button>
        </div>
      </form>
    </div>
  );
}
