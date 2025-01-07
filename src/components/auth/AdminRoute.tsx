import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/contexts/auth-context';
import { adminAuth } from '@/auth/AdminAuth';
import { Loading } from '@/components/layout/Loading';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const auth = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      if (!auth.principal) {
        setIsAuthorized(false);
        return;
      }

      const userPrincipal = typeof auth.principal === 'string' 
        ? Principal.fromText(auth.principal)
        : auth.principal;

      const hasAccess = await adminAuth.validateAccess(userPrincipal);
      setIsAuthorized(hasAccess);
    };

    checkAccess();
  }, [auth.principal]);

  if (isAuthorized === null) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};