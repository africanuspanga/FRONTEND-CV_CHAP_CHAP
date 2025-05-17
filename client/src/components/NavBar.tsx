import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useCVData } from '@/hooks/useCVData';
import { useCVForm } from '@/contexts/cv-form-context';
import { useAuth } from '@/contexts/auth-context';
import UserProfileMenu from './UserProfileMenu';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { resetCVData } = useCVData();
  const { resetForm } = useCVForm();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/templates', label: 'Templates' },
    { path: '/cv-steps', label: 'Create CV' },
    { path: '/why-us', label: 'Why Us' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location === path;
  
  const handleResetCV = () => {
    if (window.confirm('Are you sure you want to reset your CV? This will clear all your data.')) {
      // Reset both data stores
      resetCVData();
      resetForm();
      
      // Also clear any form data saved in localStorage
      localStorage.removeItem('cv-form-data');
      localStorage.removeItem('cv-form-step');
      
      // Navigate to the CV steps page
      navigate('/cv-steps');
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-3xl font-bold text-primary">CV Chap Chap</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium',
                  isActive(route.path)
                    ? 'text-primary'
                    : 'text-darkText hover:text-primary'
                )}
              >
                {route.label}
              </Link>
            ))}
            
            {/* Only show Reset CV button on CV creation-related pages */}
            {location.includes('/create') || location.includes('/templates') ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleResetCV}
              >
                <RefreshCcw className="h-4 w-4" />
                Reset CV
              </Button>
            ) : null}
            
            {isAuthenticated ? (
              <UserProfileMenu username={user?.username || user?.full_name || 'User'} />
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/register" className="px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-primary"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn('md:hidden bg-white', isMobileMenuOpen ? 'block' : 'hidden')}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                'block px-3 py-2 rounded-md text-base font-medium',
                isActive(route.path)
                  ? 'text-primary'
                  : 'text-darkText hover:text-primary'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {route.label}
            </Link>
          ))}
          
          {/* Only show Reset CV button on CV creation-related pages */}
          {location.includes('/create') || location.includes('/templates') ? (
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-darkText hover:text-primary"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleResetCV();
              }}
            >
              <div className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reset CV
              </div>
            </button>
          ) : null}
          
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-darkText hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Profile
              </Link>
              
              <Link
                href="/my-cvs"
                className="block px-3 py-2 rounded-md text-base font-medium text-darkText hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My CVs
              </Link>
              
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-darkText hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
