import { ReactNode } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [_, navigate] = useLocation();

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          );
        }

        if (!isAuthenticated) {
          // Redirect to login page with a return_to parameter
          navigate(`/login?return_to=${encodeURIComponent(path)}`);
          return null;
        }

        return <Component />;
      }}
    </Route>
  );
}