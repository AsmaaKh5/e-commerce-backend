import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [loading, isAuthenticated, router]);

  return { isAuthenticated, loading };
}

export function AuthGate({ children }) {
  const { loading, isAuthenticated } = useRequireAuth();

  if (loading || !isAuthenticated) {
    return (
      <div className="container-app flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return children;
}
