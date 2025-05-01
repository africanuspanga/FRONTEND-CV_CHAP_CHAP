import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, FileText, CreditCard, PercentIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DashboardStats {
  total_users: number;
  total_cvs: number;
  total_templates: number;
  total_payments: number;
  cv_completion_rate: number;
  payment_success_rate: number;
  total_revenue: number;
  currency: string;
  recent_users: any[];
  recent_payments: any[];
}

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTimeFrame, setActiveTimeFrame] = useState<string>('24h');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // This would be a real API call in production
        // const token = localStorage.getItem('admin_access_token');
        // const response = await fetch(`${API_BASE_URL}/api/admin/`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // const data = await response.json();
        
        // For demo purposes, we're using mock data
        setTimeout(() => {
          setStats({
            total_users: 0,
            total_cvs: 0,
            total_templates: 15, // We have 15 templates in the system
            total_payments: 0,
            cv_completion_rate: 0,
            payment_success_rate: 0,
            total_revenue: 0,
            currency: 'TSh',
            recent_users: [],
            recent_payments: []
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, activeTimeFrame]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Tabs defaultValue={activeTimeFrame} onValueChange={setActiveTimeFrame}>
              <TabsList>
                <TabsTrigger value="24h">24h</TabsTrigger>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {stats && (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_users}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total_users === 0 ? '0 new users' : `+${Math.floor(stats.total_users * 0.1)} new users`}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CV Completion Rate</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.cv_completion_rate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total_cvs === 0 ? '0 of 0 CVs completed' : `${stats.total_cvs} of ${Math.floor(stats.total_cvs / (stats.cv_completion_rate / 100))} CVs completed`}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
                  <PercentIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.payment_success_rate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total_payments === 0 ? '0 of 0 payments successful' : `${Math.floor(stats.total_payments * (stats.payment_success_rate / 100))} of ${stats.total_payments} payments successful`}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.currency} {stats.total_revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(stats.total_revenue * 0.05).toLocaleString()} from last period
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User activity and CV completion charts would go here */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  {/* Chart would go here - using a placeholder for now */}
                  <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded-md">
                    <div className="w-4/5 h-3/5 relative">
                      {/* Simple line chart representation */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200"></div>
                      <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                        <div className="w-1/6 h-1/5 bg-primary mx-1"></div>
                        <div className="w-1/6 h-2/5 bg-primary mx-1"></div>
                        <div className="w-1/6 h-3/5 bg-primary mx-1"></div>
                        <div className="w-1/6 h-1/5 bg-primary mx-1"></div>
                        <div className="w-1/6 h-4/5 bg-primary mx-1"></div>
                        <div className="w-1/6 h-3/5 bg-primary mx-1"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>CV Completion</CardTitle>
                  <CardDescription>Completed vs abandoned CVs</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  {/* Chart would go here - using a placeholder for now */}
                  <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded-md">
                    <div className="w-4/5 h-4/5 flex items-end justify-center space-x-6">
                      {/* Simple bar chart representation */}
                      <div className="h-full w-1/3 flex flex-col items-center justify-end">
                        <div className="w-full bg-primary h-1/2 rounded-t"></div>
                        <p className="text-xs mt-2">Completed</p>
                      </div>
                      <div className="h-full w-1/3 flex flex-col items-center justify-end">
                        <div className="w-full bg-gray-300 h-3/4 rounded-t"></div>
                        <p className="text-xs mt-2">Abandoned</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment methods and Recent activity */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Distribution of payment methods used</CardDescription>
                </CardHeader>
                <CardContent className="h-[260px] flex items-center justify-center">
                  {/* Chart would go here - using a placeholder for now */}
                  <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded-md">
                    <div className="w-40 h-40 rounded-full border-8 border-primary relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-blue-400" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 65%)' }}></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-yellow-400" style={{ clipPath: 'polygon(0 65%, 100% 65%, 100% 85%, 0 85%)' }}></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-green-400" style={{ clipPath: 'polygon(0 85%, 100% 85%, 100% 100%, 0 100%)' }}></div>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Mobile Money: 62%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm">USSD: 24%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Credit Card: 14%</span>
                  </div>
                </div>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user actions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recent_users.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recent_users.map((user, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary-dark mr-3">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.username}</p>
                            <p className="text-xs text-gray-500">{new Date(user.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent payments table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>The latest payments in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recent_payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recent_payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.user_id}</TableCell>
                          <TableCell>
                            {payment.amount} {payment.currency}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(payment.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No recent payments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
