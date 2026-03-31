import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onAddTask }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-white' : 'text-blue-200 hover:text-white'
    }`;

  return (
    <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight">
          TaskFlow
        </Link>
        {user && (
          <div className="hidden sm:flex items-center gap-4">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/calendar" className={navLinkClass}>
              Calendar
            </NavLink>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {onAddTask && (
              <button
                onClick={onAddTask}
                className="hidden sm:block bg-white text-primary text-sm font-medium px-4 py-1.5 rounded-md hover:bg-blue-50 transition"
              >
                + Add Task
              </button>
            )}
            <Link
              to="/profile"
              className="text-sm text-blue-100 hover:text-white transition"
            >
              Hello, <span className="font-semibold">{user.username}</span>
            </Link>
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
