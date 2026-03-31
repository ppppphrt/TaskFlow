import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfile, updateProfile, changePassword } from '../services/api';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setIsLoading(true);
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch {
      toast.error('Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  }

  async function saveProfile(data) {
    try {
      const res = await updateProfile(data);
      setProfile(res.data);
      toast.success('Profile updated!');
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        'Failed to update profile.';
      toast.error(msg);
      return false;
    }
  }

  async function updatePassword(data) {
    try {
      await changePassword(data);
      toast.success('Password changed successfully!');
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.detail ||
        'Failed to change password.';
      toast.error(msg);
      return false;
    }
  }

  return { profile, isLoading, saveProfile, updatePassword };
}
