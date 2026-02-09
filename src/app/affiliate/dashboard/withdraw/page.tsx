'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { ArrowLeft, FileText, Loader2, CheckCircle, AlertCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function WithdrawPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [affiliatePhone, setAffiliatePhone] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/affiliate/stats');
      const json = await res.json();
      if (res.ok) {
        setBalance(Number(json.affiliate.available_balance));
        setAffiliatePhone(json.affiliate.phone || '');
        setPhone(json.affiliate.phone || '');
      } else {
        setError(json.error || 'Failed to load balance');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchBalance();
    else if (!authLoading) setIsLoading(false);
  }, [user, authLoading, fetchBalance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const amountNum = Number(amount);
    if (amountNum < 5000) {
      setError('Minimum withdrawal is TZS 5,000');
      setIsSubmitting(false);
      return;
    }
    if (amountNum > balance) {
      setError('Insufficient balance');
      setIsSubmitting(false);
      return;
    }
    if (!phone) {
      setError('Please enter your M-Pesa number');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/affiliate/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Withdrawal request failed');
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <Link href="/auth/login?redirect=/affiliate/dashboard/withdraw" className="text-cv-blue-600 hover:underline">
            Log in to continue
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Requested!</h1>
          <p className="text-gray-600 mb-6">
            Your withdrawal of TZS {Number(amount).toLocaleString()} to {phone} has been submitted.
            You&apos;ll receive the funds once an admin approves the request.
          </p>
          <Link href="/affiliate/dashboard">
            <Button className="w-full bg-cv-blue-600 hover:bg-cv-blue-700">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/affiliate/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cv-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">CV Chap Chap</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <Wallet className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Withdraw to M-Pesa</h1>
          <p className="text-gray-600">Transfer your earnings to your mobile money account</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
          <div className="text-sm text-green-700 mb-1">Available Balance</div>
          <div className="text-3xl font-bold text-green-800">TZS {balance.toLocaleString()}</div>
        </div>

        {balance < 5000 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-yellow-800 font-medium">Minimum withdrawal is TZS 5,000</p>
            <p className="text-sm text-yellow-700 mt-1">Keep sharing your referral link to earn more!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (TZS)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 10000"
                min={5000}
                max={balance}
                required
                className="h-12"
              />
              <p className="text-xs text-gray-500 mt-1">
                Min: TZS 5,000 | Max: TZS {balance.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                M-Pesa Phone Number
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 7XX XXX XXX"
                required
                className="h-12"
              />
              {affiliatePhone && phone !== affiliatePhone && (
                <p className="text-xs text-yellow-600 mt-1">
                  This is different from your registered phone ({affiliatePhone})
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Request Withdrawal'
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Withdrawals are processed within 24-48 hours after admin approval.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
