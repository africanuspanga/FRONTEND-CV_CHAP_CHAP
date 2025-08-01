import { ReactNode, useEffect } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  fallbackMessage?: string;
  requiresProfile?: boolean; // New: require complete profile
}

export function ProtectedRoute({ 
  path, 
  component: Component,
  fallbackMessage = "This page requires authentication.",
  requiresProfile = false
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, error } = useAuth();
  const [_, navigate] = useLocation();

  // Auto-redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?return_to=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Route path={path}>
      {() => {
        // Loading state
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                <p className="text-gray-600 font-medium">Verifying authentication...</p>
              </div>
            </div>
          );
        }

        // Authentication error state
        if (error) {
          return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-white px-4">
              <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <CardTitle className="text-red-600">Authentication Error</CardTitle>
                  <CardDescription>
                    {error.message || "Unable to verify your authentication"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        }

        // Not authenticated - show fallback UI while redirecting
        if (!isAuthenticated) {
          return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
              <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <CardTitle>Authentication Required</CardTitle>
                  <CardDescription>
                    {fallbackMessage}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Login to Continue
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        }

        // Profile completion check (optional)
        if (requiresProfile && user && (!user.full_name || !user.phone_number)) {
          return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-white px-4">
              <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <CardTitle>Complete Your Profile</CardTitle>
                  <CardDescription>
                    Please complete your profile to access this feature.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate('/profile')}
                    className="w-full"
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        }

        // Authenticated - render the component
        return <Component />;
      }}
    </Route>
  );
}