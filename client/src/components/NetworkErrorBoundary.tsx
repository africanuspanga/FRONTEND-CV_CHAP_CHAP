import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";

interface NetworkErrorBoundaryProps {
  children: ReactNode;
}

export function NetworkErrorBoundary({ children }: NetworkErrorBoundaryProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRetry, setLastRetry] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setRetryCount(0);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLastRetry(new Date());
    // Force a network check
    setIsOnline(navigator.onLine);
  };

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
              <WifiOff className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-orange-800">No Internet Connection</CardTitle>
            <CardDescription className="text-orange-600">
              Please check your internet connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {retryCount > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Retry attempt {retryCount}
                  {lastRetry && (
                    <span className="block text-xs text-gray-500 mt-1">
                      Last tried: {lastRetry.toLocaleTimeString()}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleRetry}
              className="w-full flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Check Connection
            </Button>

            <div className="text-center text-sm text-gray-600 pt-4 border-t">
              <p>Tips for better connectivity:</p>
              <ul className="text-xs mt-2 space-y-1 text-left">
                <li>• Check your WiFi or mobile data</li>
                <li>• Move to an area with better signal</li>
                <li>• Restart your router if using WiFi</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Network status indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
          isOnline 
            ? 'bg-green-100 text-green-800 opacity-0 hover:opacity-100' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Offline
            </>
          )}
        </div>
      </div>
    </>
  );
}