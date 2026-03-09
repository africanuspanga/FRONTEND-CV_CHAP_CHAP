'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Copy, Check, Download, Loader2,
  Phone, MessageSquare, AlertCircle, CheckCircle2, Smartphone, Mail
} from 'lucide-react';
import { useCVStore } from '@/stores/cv-store';
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

// ─── Copy button ─────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
type Step = 'pay' | 'verify' | 'success';

export default function USSdPaymentPage() {
  const router = useRouter();
  const { cvData, templateId, selectedColor, setCVData, setTemplateId, setSelectedColor } = useCVStore();
  const [step, setStep] = useState<Step>('pay');
  const [receipt, setReceipt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Capture CV data at verification time so download always uses the correct data
  // even if Zustand state changes or the page partially reloads after payment.
  const [verifiedSnapshot, setVerifiedSnapshot] = useState<{
    cvData: typeof cvData;
    templateId: string;
    selectedColor: string | null;
  } | null>(null);

  // On mount: if Zustand state is empty (e.g. after a page reload on mobile when the
  // browser killed the tab during USSD dialing), manually restore from localStorage.
  useEffect(() => {
    if (!cvData.personalInfo.firstName) {
      try {
        const stored = localStorage.getItem('cv-chap-chap-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          const s = parsed?.state;
          if (s?.cvData?.personalInfo?.firstName) {
            setCVData(s.cvData);
            if (s.templateId) setTemplateId(s.templateId);
            if (s.selectedColor !== undefined) setSelectedColor(s.selectedColor);
          }
        }
      } catch {
        // localStorage not available or corrupt – nothing we can do
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    const trimmed = receipt.trim();
    if (!trimmed) {
      setError('Please paste your Selcom payment message.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/verify-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptText: trimmed,
          cvData,
          templateId,
          referral_code: getStoredReferralCode(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Snapshot the CV data right now so the download always uses these exact values.
        setVerifiedSnapshot({
          cvData,
          templateId: templateId || 'charles',
          selectedColor,
        });
        setStep('success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setError(data.error || 'Verification failed. Please check your message and try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      // Prefer the snapshot captured at verification time; fall back to current Zustand state.
      const downloadCvData = verifiedSnapshot?.cvData ?? cvData;
      const downloadTemplateId = verifiedSnapshot?.templateId ?? templateId ?? 'charles';
      const downloadColor = verifiedSnapshot !== null
        ? verifiedSnapshot.selectedColor
        : selectedColor;

      const TemplateComponent = getTemplate(downloadTemplateId);
      const finalColor = downloadColor || getTemplateColor(downloadTemplateId);
      const blob = await pdf(<TemplateComponent data={downloadCvData} colorOverride={finalColor} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${downloadCvData.personalInfo.firstName || 'My'}_${downloadCvData.personalInfo.lastName || 'CV'}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [verifiedSnapshot, cvData, templateId, selectedColor]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Confetti */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center px-4 py-4 max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-slate-900">Download Your CV</h1>
            <p className="text-xs text-slate-500">One-time payment · TZS 5,000</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-4 pb-10">

        {/* ── Success state ─────────────────────────────────────── */}
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
                <h2 className="text-2xl font-bold text-white mb-1">Payment Verified!</h2>
                <p className="text-green-100 text-sm">Your CV is ready to download</p>
              </div>

              <div className="p-6">
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
                <p className="text-center text-xs text-slate-400 mt-4">
                  Thank you for using CV Chap Chap 🎉
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Payment instructions (hidden after success) ────────── */}
        {step !== 'success' && (
          <>
            {/* Hero amount card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 py-7 shadow-xl">
              <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-1">To download your CV</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-blue-300">TZS</span>
                <span className="text-4xl sm:text-5xl font-extrabold">5,000</span>
              </div>
              <p className="text-blue-200 text-sm">Pay to <span className="text-white font-semibold">DRIFTMARK TECHNOLOGIES</span> via Selcom</p>
            </div>

            {/* Dial code card */}
            <div className="rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Step 1 — Dial USSD Code</p>
                  <p className="text-xs text-slate-500">Open your phone dialer and dial</p>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                {/* USSD code */}
                <div className="bg-blue-600 text-white rounded-2xl px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-200 mb-0.5">USSD Code</p>
                    <p className="text-2xl font-bold tracking-wide">*150*01*50#</p>
                  </div>
                  <CopyButton text="*150*01*50#" />
                </div>

                {/* Merchant ID */}
                <div className="bg-slate-50 rounded-2xl px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Merchant ID</p>
                    <p className="text-xl font-bold text-slate-800 tracking-wider">61115073</p>
                  </div>
                  <CopyButton text="61115073" />
                </div>

                {/* Amount */}
                <div className="bg-slate-50 rounded-2xl px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Amount to Pay</p>
                    <p className="text-xl font-bold text-slate-800">TZS 5,000</p>
                  </div>
                  <CopyButton text="5000" />
                </div>

                {/* Steps */}
                <ol className="space-y-2 pt-1">
                  {[
                    'Dial *150*01*50# on your phone',
                    'Choose Pay Bill / Pay Till',
                    'Enter Merchant ID: 61115073',
                    'Enter amount: 5000',
                    'Confirm with your mobile money PIN',
                    'You will receive a Selcom Pay SMS',
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>

                {step === 'pay' && (
                  <button
                    onClick={() => setStep('verify')}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-base transition-all"
                  >
                    <Smartphone className="h-5 w-5" />
                    I&apos;ve Paid — Paste Receipt
                  </button>
                )}
              </div>
            </div>

            {/* ── Paste receipt card (step === 'verify') ─────────── */}
            <AnimatePresence>
              {step === 'verify' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Step 2 — Paste Payment Message</p>
                      <p className="text-xs text-slate-500">Copy the SMS from Selcom Pay and paste below</p>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    {/* Example hint */}
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 font-mono leading-relaxed">
                      <p className="font-sans text-slate-400 text-xs mb-1 not-italic">Example message:</p>
                      <p>Selcom Pay</p>
                      <p>DRIFTMARK TECHNOLOGIES</p>
                      <p>Merchant# 61115073</p>
                      <p>TZS 5,000.00</p>
                      <p>TransID 503-CJ33KFK42OD</p>
                      <p>Ref 0987219237</p>
                      <p>Channel TanQR</p>
                      <p>From 255749XXXXXXX</p>
                      <p>03/10/2025 2:00:51 PM</p>
                    </div>

                    <textarea
                      className="w-full min-h-[180px] p-4 border-2 border-slate-200 focus:border-indigo-400 focus:outline-none rounded-2xl text-sm font-mono resize-none placeholder:text-slate-300 placeholder:font-sans transition-colors"
                      placeholder="Paste your Selcom Pay message here..."
                      value={receipt}
                      onChange={(e) => { setReceipt(e.target.value); setError(''); }}
                      autoFocus
                    />

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

                    {/* Character count hint */}
                    <p className="text-right text-xs text-slate-400">{receipt.trim().length} characters</p>

                    <button
                      onClick={handleVerify}
                      disabled={isLoading || !receipt.trim()}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base transition-all"
                    >
                      {isLoading ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Verifying...</>
                      ) : (
                        <><CheckCircle2 className="h-5 w-5" /> Verify &amp; Download CV</>
                      )}
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Contact support card (always visible) ─────────── */}
            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <p className="font-semibold text-slate-700 text-sm">Need help? Contact us</p>
                <p className="text-xs text-slate-400 mt-0.5">We&apos;re here to assist you</p>
              </div>
              <div className="divide-y divide-slate-50">
                {/* Call */}
                <a
                  href="tel:+255682152148"
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">Call us</p>
                    <p className="font-semibold text-slate-800">+255 682 152 148</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full flex-shrink-0">Call</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/255682152148?text=Habari%2C%20ninatoka%20CV%20Chap%20Chap%20na%20nahitaji%20msaada%20na%20malipo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">WhatsApp</p>
                    <p className="font-semibold text-slate-800">+255 682 152 148</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full flex-shrink-0">Chat</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:driftmarklabs@gmail.com?subject=CV%20Chap%20Chap%20Support"
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">Email</p>
                    <p className="font-semibold text-slate-800 text-sm truncate">driftmarklabs@gmail.com</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full flex-shrink-0">Email</span>
                </a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
