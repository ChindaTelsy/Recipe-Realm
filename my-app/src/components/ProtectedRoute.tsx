'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '@/store/store';
import { useRouter, usePathname } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [checked, setChecked] = useState(false); // Add this state
  const pathname = usePathname();
const protectedRoutes = ['/Home', '/Profile'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecked(true); // Prevent immediate redirect before React stabilizes
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (checked && !isAuthenticated && protectedRoutes.includes(pathname)) {
      router.replace('/Welcomepage'); // Redirect after check
    }
  }, [checked, isAuthenticated, router, pathname]);

  if (!checked) return <div className="text-center py-4">Loading...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
