import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
      // proceed even if API call fails
    }
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/dashboard" className="text-xl font-bold tracking-tight">
        TaskFlow
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-blue-100">
              Hello, <span className="font-semibold">{user.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-primary text-sm font-medium px-4 py-1.5 rounded-md hover:bg-blue-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium hover:text-blue-200 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-primary text-sm font-medium px-4 py-1.5 rounded-md hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
