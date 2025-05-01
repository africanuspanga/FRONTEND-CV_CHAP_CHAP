import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const AdminLoginLink: React.FC = () => {
  const [location] = useLocation();
  
  // Don't show on admin pages
  if (location.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="bg-white shadow-md hover:bg-gray-100 border-gray-200"
      >
        <a href="/admin-login" className="flex items-center space-x-1">
          <ShieldCheck className="h-4 w-4" />
          <span>Admin</span>
        </a>
      </Button>
    </div>
  );
};

export default AdminLoginLink;
