'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/admin/stat-card';
import { StatusBadge } from '@/components/admin/status-badge';
import { FileText, Users, CreditCard, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface OverviewData {
  totalUsers: number;
  totalCVs: number;
  completedPayments: number;
  totalRevenue: number;
  usersThisWeek: number;
  cvsThisWeek: number;
  paymentsThisWeek: number;
  revenueThisWeek: number;
  revenueOverTime: { date: string; revenue: number }[];
  signupsOverTime: { date: string; signups: number }[];
  templatePopularity: { template: string; count: number }[];
  recentPayments: Array<{
    id: string;
    amount: number;
    status: string;
    created_at: string;
    phone_number: string | null;
    cvs: { data: Record<string, unknown>; template_id: string } | null;
  }>;
}

export default function AdminOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [
        usersRes,
        cvsRes,
        paymentsCompletedRes,
        usersWeekRes,
        cvsWeekRes,
        paymentsWeekRes,
        recentPaymentsRes,
        allPaymentsRes,
        allCvsRes,
        recentUsersRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('cvs').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('amount').eq('status', 'completed'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabase.from('cvs').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabase.from('payments').select('amount').eq('status', 'completed').gte('created_at', weekAgo),
        supabase.from('payments').select('*, cvs(data, template_id)').order('created_at', { ascending: false }).limit(10),
        supabase.from('payments').select('amount, status, created_at').eq('status', 'completed').gte('created_at', thirtyDaysAgo),
        supabase.from('cvs').select('template_id, created_at').gte('created_at', thirtyDaysAgo),
        supabase.from('profiles').select('created_at').gte('created_at', thirtyDaysAgo),
      ]);

      const totalRevenue = (paymentsCompletedRes.data || []).reduce((s, p) => s + (p.amount || 0), 0);
      const revenueThisWeek = (paymentsWeekRes.data || []).reduce((s, p) => s + (p.amount || 0), 0);

      // Build revenue over time (last 30 days)
      const revenueByDate: Record<string, number> = {};
      const signupsByDate: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        revenueByDate[key] = 0;
        signupsByDate[key] = 0;
      }
      (allPaymentsRes.data || []).forEach((p) => {
        const key = p.created_at.slice(0, 10);
        if (revenueByDate[key] !== undefined) revenueByDate[key] += p.amount || 0;
      });
      (recentUsersRes.data || []).forEach((u) => {
        const key = u.created_at.slice(0, 10);
        if (signupsByDate[key] !== undefined) signupsByDate[key]++;
      });

      // Template popularity
      const templateCounts: Record<string, number> = {};
      (allCvsRes.data || []).forEach((cv) => {
        const tid = cv.template_id || 'unknown';
        templateCounts[tid] = (templateCounts[tid] || 0) + 1;
      });

      setData({
        totalUsers: usersRes.count || 0,
        totalCVs: cvsRes.count || 0,
        completedPayments: paymentsCompletedRes.data?.length || 0,
        totalRevenue,
        usersThisWeek: usersWeekRes.count || 0,
        cvsThisWeek: cvsWeekRes.count || 0,
        paymentsThisWeek: paymentsWeekRes.data?.length || 0,
        revenueThisWeek,
        revenueOverTime: Object.entries(revenueByDate).map(([date, revenue]) => ({
          date: date.slice(5), // MM-DD
          revenue,
        })),
        signupsOverTime: Object.entries(signupsByDate).map(([date, signups]) => ({
          date: date.slice(5),
          signups,
        })),
        templatePopularity: Object.entries(templateCounts)
          .map(([template, count]) => ({ template, count }))
          .sort((a, b) => b.count - a.count),
        recentPayments: (recentPaymentsRes.data || []) as OverviewData['recentPayments'],
      });
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-cv-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          icon={Users}
          delta={data.usersThisWeek}
        />
        <StatCard
          title="Total CVs"
          value={data.totalCVs}
          icon={FileText}
          delta={data.cvsThisWeek}
        />
        <StatCard
          title="Completed Payments"
          value={data.completedPayments}
          icon={CreditCard}
          iconColor="text-green-500"
          delta={data.paymentsThisWeek}
        />
        <StatCard
          title="Revenue"
          value={`TZS ${data.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-green-500"
          valueColor="text-green-600"
          delta={data.revenueThisWeek}
          deltaLabel="this week (TZS)"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`TZS ${Number(v).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">User Signups (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.signupsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="signups" fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">No payments yet</td>
                    </tr>
                  ) : (
                    data.recentPayments.map((p) => {
                      const cvData = p.cvs?.data as Record<string, Record<string, string>> | undefined;
                      const name = cvData?.personalInfo
                        ? `${cvData.personalInfo.firstName || ''} ${cvData.personalInfo.lastName || ''}`.trim()
                        : 'Anonymous';
                      return (
                        <tr key={p.id} className="border-b last:border-0">
                          <td className="py-2">{name}</td>
                          <td className="py-2">TZS {p.amount.toLocaleString()}</td>
                          <td className="py-2"><StatusBadge status={p.status} /></td>
                          <td className="py-2 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Template Popularity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Template Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            {data.templatePopularity.length === 0 ? (
              <p className="py-6 text-center text-gray-500">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.templatePopularity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="template" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
