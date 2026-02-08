'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable, Column } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Search } from 'lucide-react';

interface UserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  last_login: string | null;
  cv_count: number;
  provider: string;
  [key: string]: unknown;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!profiles) {
        setIsLoading(false);
        return;
      }

      // Get CV counts per user
      const { data: cvCounts } = await supabase
        .from('cvs')
        .select('user_id');

      const countMap: Record<string, number> = {};
      (cvCounts || []).forEach((cv) => {
        if (cv.user_id) {
          countMap[cv.user_id] = (countMap[cv.user_id] || 0) + 1;
        }
      });

      setUsers(
        profiles.map((p) => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          phone: p.phone,
          role: p.role || 'user',
          created_at: p.created_at,
          last_login: p.last_login,
          cv_count: countMap[p.id] || 0,
          provider: p.provider || 'email',
        }))
      );
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const columns: Column<UserRow>[] = [
    {
      key: 'full_name',
      label: 'Name',
      sortable: true,
      render: (row) => row.full_name || '—',
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (row) => row.email || '—',
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => row.phone || '—',
    },
    {
      key: 'provider',
      label: 'Provider',
      render: (row) => (
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {row.provider}
        </span>
      ),
    },
    {
      key: 'cv_count',
      label: 'CVs',
      sortable: true,
      render: (row) => row.cv_count,
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => <StatusBadge status={row.role} />,
    },
    {
      key: 'created_at',
      label: 'Joined',
      sortable: true,
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: 'last_login',
      label: 'Last Login',
      sortable: true,
      render: (row) =>
        row.last_login ? new Date(row.last_login).toLocaleDateString() : '—',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-cv-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base">All Users ({filtered.length})</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filtered} pageSize={25} emptyMessage="No users found" />
        </CardContent>
      </Card>
    </div>
  );
}
