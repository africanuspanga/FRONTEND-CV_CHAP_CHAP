'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface PhoneLoginFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function PhoneLoginForm({ onSuccess, onBack }: PhoneLoginFormProps) {
  const { signInWithOTP, verifyOTP, claimAnonymousCVs } = useAuth();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const fullPhone = phone.startsWith('+') ? phone : `+255${phone.replace(/^0/, '')}`;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.replace(/\D/g, '').length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    const { error } = await signInWithOTP(fullPhone);
    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setStep('otp');
    setCountdown(60);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (token: string) => {
    setError('');
    setIsLoading(true);

    const { error } = await verifyOTP(fullPhone, token);
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    const anonymousId = localStorage.getItem('cv_anonymous_id');
    if (anonymousId) {
      const claimed = await claimAnonymousCVs(anonymousId);
      if (claimed > 0) {
        localStorage.removeItem('cv_anonymous_id');
      }
    }

    setIsLoading(false);
    onSuccess();
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    setIsLoading(true);
    const { error } = await signInWithOTP(fullPhone);
    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setOtp(['', '', '', '', '', '']);
    setCountdown(60);
  };

  if (step === 'otp') {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setStep('phone')}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Change number
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to
          </p>
          <p className="font-medium text-gray-900">{fullPhone}</p>
        </div>

        <div className="flex justify-center gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { otpRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-cv-blue-500"
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isLoading}
            className="text-sm text-cv-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2 mt-1">
          <div className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600 shrink-0">
            +255
          </div>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="7XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
            required
            className="flex-1"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-cv-blue-600 hover:bg-cv-blue-700"
        disabled={isLoading}
      >
        {isLoading ? 'Sending code...' : 'Send Verification Code'}
      </Button>
    </form>
  );
}
