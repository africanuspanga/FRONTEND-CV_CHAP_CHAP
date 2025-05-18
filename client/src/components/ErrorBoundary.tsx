import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in the child component tree.
 * It displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console and call onError callback if provided
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Report error to monitoring service or custom handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = (): void => {
    // Reset the error state
    this.setState({
      hasError: false,
      error: null
    });
    
    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, use the default error UI
      return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-bold mb-2 dark:text-white">Something went wrong</h2>
            
            <div className="mt-2 mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-left overflow-auto max-h-60 w-full">
              <p className="text-sm text-gray-800 dark:text-gray-300 font-mono">
                {this.state.error?.message || 'Unknown error occurred'}
              </p>
            </div>
            
            <Button 
              onClick={this.resetErrorBoundary}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              If this problem persists, try reloading the page or clearing your browser storage.
            </p>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;