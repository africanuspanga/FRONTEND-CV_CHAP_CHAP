import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import {
  Users,
  FileText,
  CreditCard,
  BarChart,
  Settings,
  QrCode,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [location, navigate] = useLocation();
  const { user, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin-dashboard', icon: BarChart },
    { name: 'Users', href: '/admin-users', icon: Users },
    { name: 'Templates', href: '/admin-templates', icon: FileText },
    { name: 'Payments', href: '/admin-payments', icon: CreditCard },
    { name: 'USSD Verification', href: '/admin-ussd-verification', icon: QrCode },
    { name: 'Analytics', href: '/admin-analytics', icon: BarChart },
    { name: 'Settings', href: '/admin-settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 transform lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white overflow-hidden">
              <img src="/images/cv-logo.png" alt="CV Chap Chap Logo" className="object-cover h-full w-full" />
            </div>
            <h1 className="text-xl font-bold">CV Chap Chap</h1>
          </div>
          <button
            className="p-1 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="bg-white border-b shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="p-1 mr-4 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="ml-auto flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative px-3 py-2 rounded-lg flex items-center gap-2 border border-gray-200 hover:bg-gray-50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white overflow-hidden">
                        <img src="/images/cv-logo.png" alt="CV Chap Chap Logo" className="object-cover h-full w-full" />
                      </div>
                      <span className="font-medium">Admin</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white overflow-hidden">
                        <img src="/images/cv-logo.png" alt="CV Chap Chap Logo" className="object-cover h-full w-full" />
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin-settings"
                        className="cursor-pointer flex w-full items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
