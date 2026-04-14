import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import CalendarView from './views/CalendarView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';
import GuestView from './views/GuestView';
import HowToUseView from './views/HowToUseView';
import NotFoundView from './views/NotFoundView';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public: redirect to dashboard if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<AuthView mode="login" />} />
            <Route path="/register" element={<AuthView mode="register" />} />
          </Route>

          {/* Guest: always accessible */}
          <Route path="/guest" element={<GuestView />} />
          <Route path="/how-to-use" element={<HowToUseView />} />

          {/* Private: must be logged in */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/profile" element={<ProfileView />} />
          </Route>

          {/* Admin: must be logged in and is_staff */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminView />} />
          </Route>

          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
