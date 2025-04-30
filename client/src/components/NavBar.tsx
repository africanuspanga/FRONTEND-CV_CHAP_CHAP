import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/templates', label: 'Templates' },
    { path: '/create/method', label: 'Create CV' },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary">CV Chap Chap</h1>
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
            
            <Button asChild variant="outline">
              <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/signup" className="px-4 py-2 rounded-md text-sm font-medium">
                Sign Up
              </Link>
            </Button>
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
          
          <Link
            href="/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-darkText hover:text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          
          <Link
            href="/signup"
            className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
