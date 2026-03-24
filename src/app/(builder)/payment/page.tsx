'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Loader2, Phone,
  CheckCircle2, AlertCircle, Smartphone, Mail,
} from 'lucide-react';
import { useCVStore } from '@/stores/cv-store';
import { useAuth } from '@/lib/auth/context';
import { getStoredReferralCode } from '@/components/referral-tracker';
import { pdf } from '@react-pdf/renderer';
import { getTemplate, getTemplateColor } from '@/lib/pdf/generator';

// ─── Confetti ────────────────────────────────────────────────────────────────

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

function Confetti() {
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 2.5 + Math.random() * 2,
    rotateStart: Math.random() * 360,
    size: 7 + Math.random() * 9,
    isRect: Math.random() > 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -24, x: `${p.left}vw`, opacity: 1, rotate: p.rotateStart, scale: 1 }}
          animate={{ y: '110vh', opacity: [1, 1, 0.6, 0], rotate: p.rotateStart + 720, scale: [1, 0.9, 0.6] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            top: 0,
            width: p.size,
            height: p.isRect ? p.size * 0.55 : p.size,
            borderRadius: p.isRect ? 2 : '50%',
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Step = 'form' | 'waiting' | 'success';

export default function PaymentPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { cvData, templateId, selectedColor } = useCVStore();

  const [step, setStep] = useState<Step>('form');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [cvId, setCvId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  // Auth gate
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/payment');
    }
  }, [authLoading, user, router]);

  // Pre-fill phone from profile
  useEffect(() => {
    if (profile?.phone) {
      setPhone(profile.phone.replace(/^\+/, ''));
    }
  }, [profile]);

  // Polling
  useEffect(() => {
    if (step !== 'waiting' || !reference) return;

    pollCountRef.current = 0;
    const MAX_POLLS = 100; // ~5 minutes at 3s intervals

    const poll = async () => {
      pollCountRef.current += 1;

      // Timeout after ~5 minutes
      if (pollCountRef.current > MAX_POLLS) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setError('Payment confirmation timed out. If you paid successfully, contact support: +255 682 152 148');
        setStep('form');
        return;
      }

      try {
        const res = await fetch(`/api/payment/status?orderId=${reference}`);
        const data = await res.json();

        if (data.status === 'completed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (data.cvId) setCvId(data.cvId);
          setStep('success');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5500);
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', { value: 5000, currency: 'TZS' });
          }
        } else if (data.status === 'failed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setError('Payment was declined. Please try again.');
          setStep('form');
        }
      } catch {
        // ignore transient network errors during polling
      }
    };

    // First check immediately after a short delay (give Snippe a moment)
    const initialDelay = setTimeout(poll, 2000);
    pollingRef.current = setInterval(poll, 3000);

    return () => {
      clearTimeout(initialDelay);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [step, reference]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = phone.replace(/\D/g, '');
    if (!clean.match(/^255\d{9}$/) && !clean.match(/^0\d{9}$/)) {
      setError('Enter a valid number: 0712345678 or 255712345678');
      return;
    }

    setIsSubmitting(true);

    try {
      const name =
        profile?.full_name ||
        `${cvData.personalInfo.firstName || ''} ${cvData.personalInfo.lastName || ''}`.trim() ||
        'Customer';
      const email =
        profile?.email ||
        cvData.personalInfo.email ||
        `${clean}@cvchapchap.com`;

      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          templateId,
          phone: clean,
          email,
          name,
          referral_code: getStoredReferralCode(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Could not initiate payment. Please try again.');
        return;
      }

      setReference(data.reference);
      if (data.cvId) setCvId(data.cvId);
      setStep('waiting');
    } catch {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);

    const ua = navigator.userAgent;
    const isSafariIOS =
      /iP(hone|ad|od)/.test(ua) &&
      /WebKit/.test(ua) &&
      !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);

    let safariWindow: Window | null = null;
    if (isSafariIOS) {
      safariWindow = window.open('', '_blank');
      if (safariWindow)
        safariWindow.document.write(
          '<html><body style="font-family:sans-serif;padding:24px;color:#333"><p>Preparing your CV PDF, please wait…</p></body></html>'
        );
    }

    try {
      let finalCvData = cvData;
      let finalTemplateId = templateId || 'charles';
      const finalColor = selectedColor;

      const isEmpty =
        !finalCvData.personalInfo.firstName && !finalCvData.personalInfo.lastName;

      if (isEmpty && cvId) {
        const recoveryRes = await fetch(`/api/cv/${cvId}`);
        if (recoveryRes.ok) {
          const recovered = await recoveryRes.json();
          finalCvData = recovered.cvData;
          finalTemplateId = recovered.templateId || finalTemplateId;
        } else {
          if (safariWindow) safariWindow.close();
          alert('Could not load your CV. Please contact support: +255 682 152 148');
          return;
        }
      } else if (isEmpty) {
        if (safariWindow) safariWindow.close();
        alert('CV data not found. Please contact support: +255 682 152 148');
        return;
      }

      const TemplateComponent = getTemplate(finalTemplateId);
      const color = finalColor || getTemplateColor(finalTemplateId);
      const blob = await pdf(
        <TemplateComponent data={finalCvData} colorOverride={color} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const filename = `${finalCvData.personalInfo.firstName || 'My'}_${finalCvData.personalInfo.lastName || 'CV'}_CV.pdf`;

      if (safariWindow) {
        safariWindow.location.href = url;
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch {
      if (safariWindow) safariWindow.close();
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [cvData, templateId, selectedColor, cvId]);

  // Loading auth state
  if (authLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center px-4 py-4 max-w-lg mx-auto">
          {step !== 'success' && (
            <button
              onClick={() => (step === 'waiting' ? setStep('form') : router.back())}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-slate-900">Download Your CV</h1>
            <p className="text-xs text-slate-500">One-time payment · TZS 5,000</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-4 pb-12">

        {/* ── Success ───────────────────────────────────────────── */}
        <AnimatePresence>
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="rounded-3xl bg-white shadow-xl border border-green-100 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 px-6 py-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <CheckCircle2 className="h-11 w-11 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-1">Payment Successful!</h2>
                <p className="text-green-100 text-sm">Your CV is ready to download</p>
              </div>

              <div className="p-6 space-y-3">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg transition-all active:scale-95"
                >
                  {isDownloading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Generating PDF...</>
                  ) : (
                    <><Download className="h-5 w-5" /> Download CV PDF</>
                  )}
                </button>

                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-95"
                >
                  View My CVs
                </button>

                <p className="text-center text-xs text-slate-400 pt-1">
                  Thank you for using CV Chap Chap
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Waiting / Polling ─────────────────────────────────── */}
        <AnimatePresence>
          {step === 'waiting' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Amount banner */}
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 py-6 shadow-xl text-center">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-2">
                  Processing Payment
                </p>
                <div className="flex items-baseline gap-2 justify-center mb-1">
                  <span className="text-sm text-blue-300">TZS</span>
                  <span className="text-4xl font-extrabold">5,000</span>
                </div>
                <p className="text-blue-200 text-xs mt-1 font-mono">
                  Ref: {reference}
                </p>
              </div>

              {/* Instruction card */}
              <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-6 text-center space-y-5">
                <div className="relative mx-auto w-20 h-20">
                  {/* Pulse rings */}
                  <span className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-50" />
                  <span className="absolute inset-2 rounded-full bg-blue-50 animate-ping opacity-40 delay-150" />
                  <div className="relative w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                    <Smartphone className="h-9 w-9 text-blue-500" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">Check Your Phone</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    A payment prompt was sent to your phone.{'\n'}Enter your mobile money PIN to confirm.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-blue-500 text-sm font-medium bg-blue-50 rounded-xl py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Waiting for confirmation...
                </div>

                {/* Steps */}
                <ol className="text-left space-y-2 text-sm text-slate-600">
                  {[
                    'Look for a payment prompt on your phone',
                    'Enter your mobile money PIN',
                    'This page will update automatically',
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>

                <button
                  onClick={() => {
                    if (pollingRef.current) clearInterval(pollingRef.current);
                    setStep('form');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
                >
                  Wrong number? Go back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phone Form ────────────────────────────────────────── */}
        <AnimatePresence>
          {step === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Amount banner */}
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 py-7 shadow-xl">
                <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-1">
                  To download your CV
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm text-blue-300">TZS</span>
                  <span className="text-4xl sm:text-5xl font-extrabold">5,000</span>
                </div>
                <p className="text-blue-200 text-sm">
                  Pay via Airtel Money, M-Pesa, or Tigo Pesa
                </p>
              </div>

              {/* Phone input card */}
              <div className="rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      Enter Your Phone Number
                    </p>
                    <p className="text-xs text-slate-500">
                      A payment prompt will be sent to this number
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
                  <div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError('');
                      }}
                      placeholder="0712 345 678"
                      className="w-full border-2 border-slate-200 focus:border-blue-500 focus:outline-none rounded-2xl px-4 py-4 text-xl font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-normal placeholder:text-lg transition-colors tracking-wider"
                      autoComplete="tel"
                      autoFocus
                    />
                    <p className="text-xs text-slate-400 mt-1.5 ml-1">
                      Accepted: 0712345678 · 255712345678 · +255712345678
                    </p>
                  </div>

                  {/* Amount locked */}
                  <div className="bg-slate-50 rounded-2xl px-4 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Amount</p>
                      <p className="text-xl font-bold text-slate-800">TZS 5,000</p>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full font-medium">
                      Fixed
                    </span>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-sm"
                      >
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSubmitting || !phone.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base transition-all"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      <><Smartphone className="h-5 w-5" /> Pay TZS 5,000</>
                    )}
                  </button>
                </form>
              </div>

              {/* Supported networks */}
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 px-5 py-4">
                <p className="text-xs text-slate-500 text-center font-medium mb-3">
                  Supported Networks
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {['Airtel Money', 'M-Pesa', 'Tigo Pesa'].map((net) => (
                    <span
                      key={net}
                      className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200"
                    >
                      {net}
                    </span>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50">
                  <p className="font-semibold text-slate-700 text-sm">Need help?</p>
                </div>
                <div className="divide-y divide-slate-50">
                  <a
                    href="https://wa.me/255682152148?text=Habari%2C%20ninatoka%20CV%20Chap%20Chap%20na%20nahitaji%20msaada%20na%20malipo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 mb-0.5">WhatsApp</p>
                      <p className="font-semibold text-slate-800">+255 682 152 148</p>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full flex-shrink-0">
                      Chat
                    </span>
                  </a>

                  <a
                    href="mailto:driftmarklabs@gmail.com?subject=CV%20Chap%20Chap%20Support"
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 mb-0.5">Email</p>
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        driftmarklabs@gmail.com
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full flex-shrink-0">
                      Email
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
