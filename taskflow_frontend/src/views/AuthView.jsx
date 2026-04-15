import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthForm } from '../hooks/useAuthForm';

export default function AuthView({ mode }) {
  const isLogin = mode === 'login';
  const { form, isLoading, error, handleChange, handleSubmit } = useAuthForm(mode);
  const [showPassword, setShowPassword] = useState(false);

  const fieldClass = 'w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition';
  const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5';

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 font-body">
      <div className="mb-8 text-center">
        <span className="text-3xl font-black tracking-tighter text-on-surface">TaskFlow</span>
        <p className="text-sm text-on-surface-variant/60 mt-1 font-medium">
          Your sanctuary of productivity.
        </p>
      </div>

      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl border border-outline-variant/10 p-8">
        <h1 className="text-2xl font-black tracking-tight text-on-surface mb-1">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-sm text-on-surface-variant/60 mb-8">
          {isLogin ? 'Log in to manage your tasks.' : 'Sign up to get started with TaskFlow.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="your_username"
              className={fieldClass}
            />
          </div>

          {!isLogin && (
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`${fieldClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant/50 hover:text-on-surface-variant transition"
                tabIndex={-1}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-error-container text-on-error-container text-sm font-medium px-4 py-3 rounded-xl">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Please wait...' : isLogin ? 'Log In' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center text-on-surface-variant/60 mt-6">
          {isLogin ? (
            <>Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
            </>
          ) : (
            <>Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </>
          )}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-outline-variant/20" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">or</span>
          <div className="flex-1 h-px bg-outline-variant/20" />
        </div>

        <Link
          to="/guest"
          className="mt-4 flex items-center justify-center gap-2 w-full border border-outline-variant/40 text-on-surface-variant text-sm font-semibold py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          Continue as Guest
        </Link>
      </div>
    </div>
  );
}
