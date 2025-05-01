import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  CreditCard,
  BarChart3,
  LogOut,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, logout } = useAdminAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin-dashboard/users', icon: <Users size={20} /> },
    { name: 'Templates', path: '/admin-dashboard/templates', icon: <FileText size={20} /> },
    { name: 'Payments', path: '/admin-dashboard/payments', icon: <CreditCard size={20} /> },
    { name: 'USSD Verification', path: '/admin-dashboard/ussd-verification', icon: <MessageSquare size={20} /> },
    { name: 'Analytics', path: '/admin-dashboard/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Settings', path: '/admin-dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header for mobile */}
      <header className="bg-white border-b p-4 flex justify-between items-center md:hidden">
        <div className="flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">CV Chap Chap Admin</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={20} />
                  </Button>
                </div>
              </div>
              <nav className="px-2 py-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <a
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors',
                            location === item.path
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </a>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut size={20} />
                      <span className="ml-3">Logout</span>
                    </Button>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">CV Chap Chap Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium">{admin?.email}</div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <h2 className="text-lg font-bold">CV Chap Chap Admin</h2>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        location === item.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </a>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="hidden md:flex items-center justify-end h-16 px-6 border-b bg-white">
            <div className="text-sm font-medium">{admin?.email}</div>
          </div>
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
