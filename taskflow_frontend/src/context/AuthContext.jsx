import React, { createContext, useContext, useState } from 'react';
import { logout as logoutApi } from '../services/api';

const AuthContext = createContext(null);

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const access = localStorage.getItem('access_token');
    if (access) {
      const decoded = decodeJWT(access);
      return decoded ? { username: decoded.username || decoded.user_id } : null;
    }
    return null;
  });

  const [tokens, setTokens] = useState(() => ({
    access: localStorage.getItem('access_token') || null,
    refresh: localStorage.getItem('refresh_token') || null,
  }));

  function login(newTokens) {
    const { access, refresh } = newTokens;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setTokens({ access, refresh });
    const decoded = decodeJWT(access);
    setUser(decoded ? { username: decoded.username || String(decoded.user_id) } : null);
  }

  async function logout() {
    try { await logoutApi(); } catch { /* proceed even if API fails */ }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setTokens({ access: null, refresh: null });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
