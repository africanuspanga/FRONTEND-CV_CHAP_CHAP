'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';

type DateRange = 'today' | '7d' | '30d' | 'all';

interface PaymentRow {
  id: string;
  customer: string;
  phone_number: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
  [key: string]: unknown;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  useEffect(() => {
    const fetchPayments = async () => {
      const supabase = createClient();

      const { data } = await supabase
        .from('payments')
        .select('*, cvs(data)')
        .order('created_at', { ascending: false });

      if (!data) {
        setIsLoading(false);
        return;
      }

      setPayments(
        data.map((p) => {
          const cvData = p.cvs?.data as Record<string, Record<string, string>> | undefined;
          const name = cvData?.personalInfo
            ? `${cvData.personalInfo.firstName || ''} ${cvData.personalInfo.lastName || ''}`.trim()
            : 'Anonymous';

          return {
            id: p.id,
            customer: name,
            phone_number: p.phone_number || '—',
            amount: p.amount || 0,
            status: p.status || 'pending',
            payment_method: p.payment_method || '—',
            transaction_id: p.transaction_id || '—',
            created_at: p.created_at,
          };
        })
      );
      setIsLoading(false);
    };

    fetchPayments();
  }, []);

  const filtered = useMemo(() => {
    let result = payments;

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (dateRange !== 'all') {
      const days = dateRange === 'today' ? 1 : dateRange === '7d' ? 7 : 30;
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      result = result.filter((p) => p.created_at >= cutoff);
    }

    return result;
  }, [payments, statusFilter, dateRange]);

  const totalRevenue = filtered
    .filter((p) => p.status === 'completed')
    .reduce((s, p) => s + p.amount, 0);

  const columns: Column<PaymentRow>[] = [
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'phone_number', label: 'Phone' },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => `TZS ${row.amount.toLocaleString()}`,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'payment_method', label: 'Method' },
    {
      key: 'transaction_id',
      label: 'Transaction ID',
      render: (row) => (
        <span className="font-mono text-xs">{row.transaction_id}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (row) => new Date(row.created_at).toLocaleDateString(),
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>

      {/* Revenue banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-sm text-green-700 font-medium">Revenue (filtered)</p>
          <p className="text-2xl font-bold text-green-700">TZS {totalRevenue.toLocaleString()}</p>
        </div>
        <p className="text-sm text-green-600">
          {filtered.filter((p) => p.status === 'completed').length} completed transactions
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <CardTitle className="text-base">Transactions ({filtered.length})</CardTitle>
            <div className="flex gap-3 sm:ml-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filtered} pageSize={25} emptyMessage="No payments found" />
        </CardContent>
      </Card>
    </div>
  );
}
