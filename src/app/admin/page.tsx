'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CreditCard, TrendingUp, LogOut } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalCVs: number;
  totalPaidCVs: number;
  totalRevenue: number;
  recentPayments: Array<{
    id: string;
    amount: number;
    status: string;
    created_at: string;
    cvs: { data: any } | null;
  }>;
}

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [usersRes, cvsRes, paymentsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('cvs').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('*').eq('status', 'completed'),
      ]);

      const totalRevenue = (paymentsRes.data || []).reduce(
        (sum, p) => sum + (p.amount || 0), 
        0
      );

      const { data: recentPayments } = await supabase
        .from('payments')
        .select('*, cvs(data)')
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalUsers: usersRes.count || 0,
        totalCVs: cvsRes.count || 0,
        totalPaidCVs: paymentsRes.data?.length || 0,
        totalRevenue,
        recentPayments: recentPayments || [],
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cv-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              <span className="text-lg font-bold">CV Chap Chap</span>
            </Link>
            <span className="bg-red-500 text-xs px-2 py-1 rounded font-medium">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{profile?.email}</span>
            <button onClick={signOut} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Total Users</CardTitle>
              <Users className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Total CVs</CardTitle>
              <FileText className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalCVs || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Paid CVs</CardTitle>
              <CreditCard className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats?.totalPaidCVs || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Total Revenue</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                TZS {(stats?.totalRevenue || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No payments yet
                      </td>
                    </tr>
                  ) : (
                    stats?.recentPayments.map((payment) => (
                      <tr key={payment.id} className="border-b last:border-0">
                        <td className="py-3">
                          {payment.cvs?.data?.personalInfo?.firstName || 'Anonymous'}{' '}
                          {payment.cvs?.data?.personalInfo?.lastName || ''}
                        </td>
                        <td className="py-3">TZS {payment.amount.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
