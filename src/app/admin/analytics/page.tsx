'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

type Period = '7d' | '30d' | '90d' | 'all';

interface AnalyticsData {
  revenueOverTime: { date: string; revenue: number }[];
  signupsOverTime: { date: string; signups: number }[];
  paymentStatus: { name: string; value: number }[];
  templatePopularity: { template: string; count: number }[];
  funnel: { stage: string; count: number }[];
}

const PIE_COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30d');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const supabase = createClient();

      const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365 * 5;
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const [paymentsRes, usersRes, cvsRes, allPaymentsRes] = await Promise.all([
        supabase.from('payments').select('amount, status, created_at').gte('created_at', cutoff),
        supabase.from('profiles').select('created_at').gte('created_at', cutoff),
        supabase.from('cvs').select('template_id, created_at').gte('created_at', cutoff),
        supabase.from('payments').select('status').gte('created_at', cutoff),
      ]);

      const payments = paymentsRes.data || [];
      const users = usersRes.data || [];
      const cvs = cvsRes.data || [];
      const allPayments = allPaymentsRes.data || [];

      // Revenue over time
      const revenueByDate: Record<string, number> = {};
      const signupsByDate: Record<string, number> = {};
      const displayDays = Math.min(days, 90);
      for (let i = displayDays - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        revenueByDate[key] = 0;
        signupsByDate[key] = 0;
      }
      payments
        .filter((p) => p.status === 'completed')
        .forEach((p) => {
          const key = p.created_at.slice(0, 10);
          if (revenueByDate[key] !== undefined) revenueByDate[key] += p.amount || 0;
        });
      users.forEach((u) => {
        const key = u.created_at.slice(0, 10);
        if (signupsByDate[key] !== undefined) signupsByDate[key]++;
      });

      // Payment status distribution
      const statusCounts: Record<string, number> = {};
      allPayments.forEach((p) => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      });

      // Template popularity
      const templateCounts: Record<string, number> = {};
      cvs.forEach((cv) => {
        const tid = cv.template_id || 'unknown';
        templateCounts[tid] = (templateCounts[tid] || 0) + 1;
      });

      // Funnel
      const totalUsers = users.length;
      const totalCvs = cvs.length;
      const initiated = allPayments.length;
      const completed = allPayments.filter((p) => p.status === 'completed').length;

      setData({
        revenueOverTime: Object.entries(revenueByDate).map(([date, revenue]) => ({
          date: date.slice(5),
          revenue,
        })),
        signupsOverTime: Object.entries(signupsByDate).map(([date, signups]) => ({
          date: date.slice(5),
          signups,
        })),
        paymentStatus: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
        templatePopularity: Object.entries(templateCounts)
          .map(([template, count]) => ({ template, count }))
          .sort((a, b) => b.count - a.count),
        funnel: [
          { stage: 'Users', count: totalUsers },
          { stage: 'CVs Created', count: totalCvs },
          { stage: 'Payments Initiated', count: initiated },
          { stage: 'Completed', count: completed },
        ],
      });
      setIsLoading(false);
    };

    fetchData();
  }, [period]);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1">
          {(['7d', '30d', '90d', 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.funnel.map((step, i) => {
              const pct = i > 0 && data.funnel[0].count > 0
                ? Math.round((step.count / data.funnel[0].count) * 100)
                : 100;
              return (
                <div key={step.stage} className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{step.count}</p>
                  <p className="text-sm text-gray-500">{step.stage}</p>
                  {i > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{pct}% of users</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`TZS ${Number(v).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">User Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {data.paymentStatus.length === 0 ? (
              <p className="py-6 text-center text-gray-500">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.paymentStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                  >
                    {data.paymentStatus.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Template Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            {data.templatePopularity.length === 0 ? (
              <p className="py-6 text-center text-gray-500">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
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
