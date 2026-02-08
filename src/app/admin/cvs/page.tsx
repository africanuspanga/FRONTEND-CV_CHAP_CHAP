'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable, Column } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Search } from 'lucide-react';

interface CVRow {
  id: string;
  title: string;
  user_email: string;
  template_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  download_count: number;
  [key: string]: unknown;
}

export default function AdminCVs() {
  const [cvs, setCvs] = useState<CVRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');

  useEffect(() => {
    const fetchCVs = async () => {
      const supabase = createClient();

      const { data: cvsData } = await supabase
        .from('cvs')
        .select('*, profiles(email, full_name)')
        .order('created_at', { ascending: false });

      if (!cvsData) {
        setIsLoading(false);
        return;
      }

      setCvs(
        cvsData.map((cv) => {
          const cvData = cv.data as Record<string, Record<string, string>> | null;
          const firstName = cvData?.personalInfo?.firstName || '';
          const lastName = cvData?.personalInfo?.lastName || '';
          const title = `${firstName} ${lastName}`.trim() || 'Untitled CV';
          const profile = cv.profiles as Record<string, string> | null;

          return {
            id: cv.id,
            title,
            user_email: profile?.email || '(anonymous)',
            template_id: cv.template_id || 'unknown',
            status: cv.status || 'draft',
            created_at: cv.created_at,
            updated_at: cv.updated_at || cv.created_at,
            download_count: cv.download_count || 0,
          };
        })
      );
      setIsLoading(false);
    };

    fetchCVs();
  }, []);

  const templates = useMemo(
    () => [...new Set(cvs.map((c) => c.template_id))].sort(),
    [cvs]
  );

  const filtered = useMemo(() => {
    let result = cvs;
    if (statusFilter !== 'all') result = result.filter((c) => c.status === statusFilter);
    if (templateFilter !== 'all') result = result.filter((c) => c.template_id === templateFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.user_email.toLowerCase().includes(q) ||
          c.template_id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [cvs, statusFilter, templateFilter, search]);

  const columns: Column<CVRow>[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'user_email', label: 'User', sortable: true },
    {
      key: 'template_id',
      label: 'Template',
      sortable: true,
      render: (row) => (
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {row.template_id}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: 'updated_at',
      label: 'Updated',
      sortable: true,
      render: (row) => new Date(row.updated_at).toLocaleDateString(),
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">CVs</h1>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-base">All CVs ({filtered.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search title, user, template..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="downloaded">Downloaded</option>
              </select>
              <select
                value={templateFilter}
                onChange={(e) => setTemplateFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All Templates</option>
                {templates.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filtered} pageSize={25} emptyMessage="No CVs found" />
        </CardContent>
      </Card>
    </div>
  );
}
