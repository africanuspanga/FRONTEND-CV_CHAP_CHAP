'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle, XCircle, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface Affiliate {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  referral_code: string;
  status: string;
  commission_rate: number;
  total_earnings: number;
  total_withdrawn: number;
  available_balance: number;
  total_clicks: number;
  total_conversions: number;
  created_at: string;
}

interface Payout {
  id: string;
  affiliate_id: string;
  amount: number;
  phone: string;
  status: string;
  created_at: string;
  affiliate_name?: string;
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [tab, setTab] = useState<'affiliates' | 'payouts'>('affiliates');

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      const [affRes, payoutRes] = await Promise.all([
        supabase
          .from('affiliates')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('affiliate_payouts')
          .select('*, affiliates(full_name)')
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (affRes.data) setAffiliates(affRes.data);
      if (payoutRes.data) {
        setPayouts(
          payoutRes.data.map((p: Record<string, unknown>) => ({
            ...p,
            affiliate_name: (p.affiliates as Record<string, string>)?.full_name || 'Unknown',
          })) as Payout[]
        );
      }
    } catch (err) {
      console.error('Failed to fetch affiliate data:', err);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateAffiliateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setAffiliates((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error('Failed to update affiliate:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const updatePayoutStatus = async (id: string, status: string, affiliateId: string, amount: number) => {
    setActionLoading(id);
    try {
      const updateData: Record<string, unknown> = { status };
      if (status === 'completed' || status === 'approved') {
        updateData.processed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('affiliate_payouts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // If rejected, refund the held balance
      if (status === 'rejected') {
        const affiliate = affiliates.find((a) => a.id === affiliateId);
        if (affiliate) {
          await supabase
            .from('affiliates')
            .update({
              available_balance: Number(affiliate.available_balance) + amount,
              updated_at: new Date().toISOString(),
            })
            .eq('id', affiliateId);
        }
      }

      // If completed, update total_withdrawn
      if (status === 'completed') {
        const affiliate = affiliates.find((a) => a.id === affiliateId);
        if (affiliate) {
          await supabase
            .from('affiliates')
            .update({
              total_withdrawn: Number(affiliate.total_withdrawn) + amount,
              updated_at: new Date().toISOString(),
            })
            .eq('id', affiliateId);
        }
      }

      setPayouts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      // Refresh affiliate data to get updated balances
      fetchData();
    } catch (err) {
      console.error('Failed to update payout:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const pendingAffiliates = affiliates.filter((a) => a.status === 'pending');
  const pendingPayouts = payouts.filter((p) => p.status === 'pending');

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      suspended: 'bg-gray-100 text-gray-700',
      completed: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Affiliates</h1>
        <p className="text-gray-500 text-sm mt-1">Manage affiliate applications and payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Users className="w-4 h-4" />
            Total Affiliates
          </div>
          <div className="text-2xl font-bold text-gray-900">{affiliates.length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Pending Approval</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingAffiliates.length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <DollarSign className="w-4 h-4" />
            Pending Payouts
          </div>
          <div className="text-2xl font-bold text-orange-600">{pendingPayouts.length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Total Conversions</div>
          <div className="text-2xl font-bold text-green-600">
            {affiliates.reduce((sum, a) => sum + a.total_conversions, 0)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('affiliates')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'affiliates' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          Affiliates {pendingAffiliates.length > 0 && (
            <span className="ml-1 bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full">
              {pendingAffiliates.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('payouts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'payouts' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          Payouts {pendingPayouts.length > 0 && (
            <span className="ml-1 bg-orange-400 text-orange-900 text-xs px-1.5 py-0.5 rounded-full">
              {pendingPayouts.length}
            </span>
          )}
        </button>
      </div>

      {/* Affiliates Table */}
      {tab === 'affiliates' && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Clicks</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Conversions</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Earnings</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {affiliates.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{a.full_name}</div>
                      <div className="text-xs text-gray-500">{a.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{a.referral_code}</td>
                    <td className="px-4 py-3">{statusBadge(a.status)}</td>
                    <td className="px-4 py-3 text-gray-600">{a.total_clicks}</td>
                    <td className="px-4 py-3 text-gray-600">{a.total_conversions}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      TZS {Number(a.total_earnings).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {a.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50"
                              disabled={actionLoading === a.id}
                              onClick={() => updateAffiliateStatus(a.id, 'approved')}
                            >
                              {actionLoading === a.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              disabled={actionLoading === a.id}
                              onClick={() => updateAffiliateStatus(a.id, 'rejected')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {a.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-gray-600"
                            disabled={actionLoading === a.id}
                            onClick={() => updateAffiliateStatus(a.id, 'suspended')}
                          >
                            Suspend
                          </Button>
                        )}
                        {a.status === 'suspended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-green-600"
                            disabled={actionLoading === a.id}
                            onClick={() => updateAffiliateStatus(a.id, 'approved')}
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {affiliates.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No affiliates yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payouts Table */}
      {tab === 'payouts' && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Affiliate</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Requested</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.affiliate_name}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      TZS {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50"
                              disabled={actionLoading === p.id}
                              onClick={() => updatePayoutStatus(p.id, 'approved', p.affiliate_id, Number(p.amount))}
                            >
                              {actionLoading === p.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              disabled={actionLoading === p.id}
                              onClick={() => updatePayoutStatus(p.id, 'rejected', p.affiliate_id, Number(p.amount))}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {p.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                            disabled={actionLoading === p.id}
                            onClick={() => updatePayoutStatus(p.id, 'completed', p.affiliate_id, Number(p.amount))}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {payouts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No payout requests yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
