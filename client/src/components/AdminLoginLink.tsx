import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const AdminLoginLink: React.FC = () => {
  return (
    <div className="fixed right-4 bottom-4 z-10">
      <Link href="/admin-dashboard/login">
        <Button size="sm" variant="outline" className="bg-white/95 shadow-md rounded-full p-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="ml-2 text-xs">Admin</span>
        </Button>
      </Link>
    </div>
  );
};

export default AdminLoginLink;
