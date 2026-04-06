import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFoundView() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center font-body">
      <p className="text-8xl font-black tracking-tighter text-primary/20 mb-4">404</p>
      <h1 className="text-2xl font-black tracking-tight text-on-surface mb-2">Page not found</h1>
      <p className="text-sm text-on-surface-variant/60 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to={user ? '/dashboard' : '/login'}
        className="bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold px-6 py-2.5 rounded-xl active:scale-95 transition-transform"
      >
        {user ? 'Back to Dashboard' : 'Go to Login'}
      </Link>
    </div>
  );
}
