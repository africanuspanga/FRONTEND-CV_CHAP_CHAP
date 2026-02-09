'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import {
  FileText,
  DollarSign,
  MousePointerClick,
  TrendingUp,
  Copy,
  Check,
  Loader2,
  LogOut,
  ExternalLink,
  Wallet,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AffiliateData {
  affiliate: {
    id: string;
    referral_code: string;
    status: string;
    commission_rate: number;
    total_earnings: number;
    total_withdrawn: number;
    available_balance: number;
    total_clicks: number;
    total_conversions: number;
    created_at: string;
  };
  conversions: Array<{
    id: string;
    amount: number;
    commission: number;
    status: string;
    created_at: string;
  }>;
  payouts: Array<{
    id: string;
    amount: number;
    phone: string;
    status: string;
    created_at: string;
  }>;
  monthlyClicks: number;
  monthlyConversions: number;
}

export default function AffiliateDashboardPage() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [data, setData] = useState<AffiliateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/affiliate/stats');
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to load data');
        return;
      }
      setData(json);
    } catch {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchStats();
    else if (!authLoading) setIsLoading(false);
  }, [user, authLoading, fetchStats]);

  const copyLink = () => {
    if (!data) return;
    const link = `${window.location.origin}?ref=${data.affiliate.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cv-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <Link href="/auth/login?redirect=/affiliate/dashboard" className="text-cv-blue-600 hover:underline">
            Log in to continue
          </Link>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">No Affiliate Account</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/affiliate/register"
            className="px-6 py-3 bg-cv-blue-600 text-white font-semibold rounded-lg hover:bg-cv-blue-700 transition-colors"
          >
            Become an Affiliate
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { affiliate, conversions, payouts, monthlyClicks, monthlyConversions } = data;
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${affiliate.referral_code}`;
  const conversionRate = affiliate.total_clicks > 0
    ? ((affiliate.total_conversions / affiliate.total_clicks) * 100).toFixed(1)
    : '0';

  const isPending = affiliate.status === 'pending';
  const isSuspended = affiliate.status === 'suspended';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cv-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">CV Chap Chap</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Affiliate</span>
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Status Banner */}
        {isPending && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800">Application Pending</h3>
              <p className="text-sm text-yellow-700">Your affiliate application is being reviewed. You&apos;ll be able to start earning once approved.</p>
            </div>
          </div>
        )}

        {isSuspended && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Account Suspended</h3>
              <p className="text-sm text-red-700">Your affiliate account has been suspended. Contact support for more information.</p>
            </div>
          </div>
        )}

        {/* Referral Link */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Your Referral Link</h2>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 truncate font-mono">
              {referralLink}
            </div>
            <Button onClick={copyLink} variant="outline" className="flex-shrink-0 gap-2">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Share this link on WhatsApp, social media, or anywhere. Code: <strong>{affiliate.referral_code}</strong></p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={DollarSign}
            label="Available Balance"
            value={`TZS ${Number(affiliate.available_balance).toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Earnings"
            value={`TZS ${Number(affiliate.total_earnings).toLocaleString()}`}
            color="blue"
          />
          <StatCard
            icon={MousePointerClick}
            label="Total Clicks"
            value={affiliate.total_clicks.toLocaleString()}
            sub={`${monthlyClicks} this month`}
            color="purple"
          />
          <StatCard
            icon={DollarSign}
            label="Conversions"
            value={affiliate.total_conversions.toLocaleString()}
            sub={`${conversionRate}% rate | ${monthlyConversions} this month`}
            color="orange"
          />
        </div>

        {/* Withdraw Button */}
        <div className="mb-8">
          <Link href="/affiliate/dashboard/withdraw">
            <Button
              disabled={isPending || isSuspended || affiliate.available_balance < 5000}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Wallet className="w-4 h-4" />
              Withdraw to M-Pesa
            </Button>
          </Link>
          {affiliate.available_balance < 5000 && affiliate.available_balance > 0 && (
            <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: TZS 5,000</p>
          )}
        </div>

        {/* Recent Conversions */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Conversions</h3>
            <span className="text-sm text-gray-500">{conversions.length} total</span>
          </div>
          {conversions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No conversions yet. Share your referral link to start earning!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Sale Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Commission</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {conversions.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 text-gray-600">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-900">TZS {Number(c.amount).toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">+TZS {Number(c.commission).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          c.status === 'confirmed' ? 'bg-green-100 text-green-700'
                            : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Payouts */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Payout History</h3>
            <Link href="/affiliate/dashboard/withdraw" className="text-sm text-cv-blue-600 hover:underline flex items-center gap-1">
              Request Withdrawal <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          {payouts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No payouts yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payouts.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-gray-600">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">TZS {Number(p.amount).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          p.status === 'completed' ? 'bg-green-100 text-green-700'
                            : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                            : p.status === 'approved' ? 'bg-blue-100 text-blue-700'
                            : p.status === 'processing' ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}) {
  const colors = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}
