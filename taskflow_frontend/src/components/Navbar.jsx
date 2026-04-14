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
    isActive
      ? 'text-primary font-bold border-b-2 border-primary pb-1 transition-colors duration-200'
      : 'text-on-surface/60 font-medium hover:bg-surface-container-low transition-colors duration-200 px-3 py-1 rounded-lg';

  return (
    <nav className="bg-surface/80 backdrop-blur-lg sticky top-0 z-50 shadow-xl shadow-on-surface/5">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/dashboard" className="text-2xl font-black text-on-surface tracking-tighter">
            TaskFlow
          </Link>
          {user && (
            <div className="hidden md:flex gap-8 items-center text-sm">
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/calendar" className={navLinkClass}>Calendar</NavLink>
              {user.is_staff && (
                <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              {onAddTask && (
                <button
                  onClick={onAddTask}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm tracking-tight active:scale-95 transition-transform duration-150 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Task
                </button>
              )}
              <div className="flex items-center gap-4 pl-6 border-l border-outline-variant/20">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-on-surface/60">account_circle</span>
                  <span className="text-sm font-semibold text-on-surface">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-on-surface/60 text-[11px] uppercase tracking-widest font-bold hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/how-to-use" className="text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">
                How to use
              </Link>
              <Link to="/login" className="text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
