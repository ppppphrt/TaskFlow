import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register as registerApi, login as loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useAuthForm(mode) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const res = await loginApi({ username: form.username, password: form.password });
        login({ access: res.data.access, refresh: res.data.refresh });
        navigate('/dashboard');
      } else {
        await registerApi({ username: form.username, email: form.email, password: form.password });
        toast.success('Account created! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      const data = err.response?.data;
      let message = 'Something went wrong. Please try again.';
      if (data) {
        const firstKey = Object.keys(data)[0];
        const firstVal = data[firstKey];
        message = Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return { form, isLoading, handleChange, handleSubmit };
}
