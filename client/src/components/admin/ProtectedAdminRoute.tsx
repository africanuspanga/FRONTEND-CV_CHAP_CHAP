import React from 'react';
import { Redirect, Route } from 'wouter';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  path: string;
  component: React.ComponentType;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ path, component: Component }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isAuthenticated ? (
        <Component />
      ) : (
        <Redirect to="/admin-login" />
      )}
    </Route>
  );
};
