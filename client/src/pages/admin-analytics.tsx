import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface AnalyticsData {
  templateUsage: Record<string, number>;
  userRegistrations: { date: string; count: number }[];
  cvCreations: { date: string; count: number }[];
  revenueTrends: { date: string; amount: number }[];
  paymentMethodDistribution: Record<string, number>;
}

const AdminAnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // This would be the real API call
        // const response = await fetch(`/api/admin/analytics?timeFrame=${timeFrame}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
        //   }
        // });
        // const data = await response.json();
        // setAnalyticsData(data);
        
        // Using mock data for now
        setTimeout(() => {
          // Generate demo data for charts
          const mockData: AnalyticsData = {
            templateUsage: {
              'Professional CV': 45,
              'Creative CV': 32,
              'Academic CV': 28,
              'Simple CV': 18,
              'Modern CV': 15,
            },
            userRegistrations: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
              count: Math.floor(Math.random() * 10) + 1,
            })),
            cvCreations: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
              count: Math.floor(Math.random() * 15) + 1,
            })),
            revenueTrends: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
              amount: Math.floor(Math.random() * 1000) + 500,
            })),
            paymentMethodDistribution: {
              'Mobile Money': 62,
              'USSD': 24,
              'Credit Card': 14,
            },
          };
          
          setAnalyticsData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeFrame]);

  // Helper functions for rendering charts
  const renderBarChart = (data: Record<string, number>, title: string) => {
    const maxValue = Math.max(...Object.values(data));
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{key}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = (data: { date: string; count: number }[] | { date: string; amount: number }[], title: string, valueKey: 'count' | 'amount') => {
    if (data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(item => (valueKey === 'count' ? (item as any).count : (item as any).amount)));
    const chartHeight = 150;
    
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="relative h-[150px]">
          <div className="absolute inset-0 flex items-end justify-between">
            {data.map((item, index) => {
              const value = valueKey === 'count' ? (item as any).count : (item as any).amount;
              const height = (value / maxValue) * chartHeight;
              return (
                <div key={index} className="flex flex-col items-center w-full">
                  <div
                    className="w-full max-w-[30px] mx-auto bg-primary rounded-t"
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-xs mt-1 truncate w-full text-center">
                    {item.date.split('-')[2]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDonutChart = (data: Record<string, number>, title: string) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    let currentAngle = 0;
    
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="#f3f4f6" />
              {Object.entries(data).map(([key, value], index) => {
                const percentage = (value / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                const endAngle = currentAngle;
                
                // Calculate SVG arc path
                const startRadians = (startAngle - 90) * (Math.PI / 180);
                const endRadians = (endAngle - 90) * (Math.PI / 180);
                const startX = 50 + 40 * Math.cos(startRadians);
                const startY = 50 + 40 * Math.sin(startRadians);
                const endX = 50 + 40 * Math.cos(endRadians);
                const endY = 50 + 40 * Math.sin(endRadians);
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 50 50`,
                  `L ${startX} ${startY}`,
                  `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  `Z`
                ].join(' ');
                
                // Different colors for each segment
                const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
                
                return <path key={index} d={pathData} fill={colors[index % colors.length]} />;
              })}
              <circle cx="50" cy="50" r="25" fill="white" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-4">
          {Object.entries(data).map(([key, value], index) => {
            const colors = ['bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500'];
            return (
              <div key={index} className="flex items-center text-sm">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
                <span>{key}: {Math.round((value / total) * 100)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <Tabs value={timeFrame} onValueChange={setTimeFrame}>
            <TabsList>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : analyticsData ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Registrations */}
            <Card>
              <CardHeader>
                <CardTitle>User Registrations</CardTitle>
                <CardDescription>New user sign-ups over time</CardDescription>
              </CardHeader>
              <CardContent>
                {renderLineChart(analyticsData.userRegistrations, 'Daily Sign-ups', 'count')}
              </CardContent>
            </Card>

            {/* CV Creations */}
            <Card>
              <CardHeader>
                <CardTitle>CV Creations</CardTitle>
                <CardDescription>Number of CVs created per day</CardDescription>
              </CardHeader>
              <CardContent>
                {renderLineChart(analyticsData.cvCreations, 'Daily CV Creations', 'count')}
              </CardContent>
            </Card>

            {/* Template Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Template Usage</CardTitle>
                <CardDescription>Most popular CV templates</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(analyticsData.templateUsage, 'Template Popularity')}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                {renderDonutChart(analyticsData.paymentMethodDistribution, 'Payment Method Distribution')}
              </CardContent>
            </Card>

            {/* Revenue Trends */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Daily revenue in {analyticsData.revenueTrends[0]?.amount > 0 ? 'TSh' : 'USD'}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderLineChart(analyticsData.revenueTrends, 'Daily Revenue', 'amount')}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No analytics data available</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
