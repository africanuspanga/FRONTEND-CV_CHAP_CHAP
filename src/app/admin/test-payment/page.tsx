'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/admin/status-badge';
import {
  Phone,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  ArrowRight,
  RotateCw,
} from 'lucide-react';

type Step = 'idle' | 'initiating' | 'initiated' | 'pushing' | 'pushed' | 'polling' | 'completed' | 'failed';

interface LogEntry {
  time: string;
  type: 'info' | 'success' | 'error' | 'request' | 'response';
  message: string;
  data?: unknown;
}

export default function TestPaymentPage() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@cvchapchap.co.tz');
  const [step, setStep] = useState<Step>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [orderId, setOrderId] = useState('');
  const [cvId, setCvId] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [pollCount, setPollCount] = useState(0);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((type: LogEntry['type'], message: string, data?: unknown) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time, type, message, data }]);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const formatPhone = (input: string): string => {
    const digits = input.replace(/\D/g, '');
    if (digits.startsWith('0')) return `255${digits.slice(1)}`;
    if (digits.startsWith('255')) return digits;
    return `255${digits}`;
  };

  const detectProvider = (phone: string): string => {
    const formatted = formatPhone(phone);
    const prefix = formatted.substring(3, 5);
    if (['74', '75', '76'].includes(prefix)) return 'Vodacom (M-Pesa)';
    if (['78', '79', '68', '69'].includes(prefix)) return 'Airtel Money';
    if (['71', '65', '67'].includes(prefix)) return 'Tigo Pesa';
    if (prefix === '62') return 'Halotel';
    return 'Unknown';
  };

  // STEP 1: Initiate payment (create order in Selcom)
  const handleInitiate = async () => {
    if (!phone) return;

    const formatted = formatPhone(phone);
    setMsisdn(formatted);
    setStep('initiating');
    setLogs([]);
    setPollCount(0);

    addLog('info', `Phone: ${formatted} (${detectProvider(phone)})`);
    addLog('request', 'POST /api/payment/initiate', {
      phone: formatted,
      email,
      name,
      templateId: 'test-template',
      cvData: { personalInfo: { firstName: 'Test', lastName: 'User' } },
    });

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formatted,
          email,
          name,
          templateId: 'classic-professional',
          cvData: {
            personalInfo: {
              firstName: name.split(' ')[0] || 'Test',
              lastName: name.split(' ')[1] || 'User',
              email,
              phone: formatted,
              professionalTitle: 'Test Payment',
              location: 'Dar es Salaam',
            },
            summary: 'Test payment CV',
            workExperiences: [],
            education: [],
            skills: [],
            languages: [],
            references: [],
            certifications: [],
            socialLinks: [],
            accomplishments: [],
          },
          anonymousId: `test-${Date.now()}`,
        }),
      });

      const data = await res.json();
      addLog('response', `Status ${res.status}`, data);

      if (!res.ok || !data.success) {
        addLog('error', data.error || 'Failed to create order');
        setStep('failed');
        return;
      }

      setOrderId(data.orderId);
      setCvId(data.cvId);
      addLog('success', `Order created: ${data.orderId}`);
      addLog('info', `CV ID: ${data.cvId}`);
      addLog('info', `MSISDN: ${data.msisdn}`);
      if (data.paymentToken) addLog('info', `Payment Token: ${data.paymentToken}`);
      setStep('initiated');
    } catch (err) {
      addLog('error', `Network error: ${err instanceof Error ? err.message : 'Unknown'}`);
      setStep('failed');
    }
  };

  // STEP 2: Push USSD to user's phone
  const handlePushUSSD = async () => {
    setStep('pushing');
    addLog('request', 'POST /api/payment/push-ussd', { orderId, msisdn });

    try {
      const res = await fetch('/api/payment/push-ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, msisdn }),
      });

      const data = await res.json();
      addLog('response', `Status ${res.status}`, data);

      if (!res.ok || !data.success) {
        addLog('error', data.error || 'USSD push failed');
        setStep('failed');
        return;
      }

      addLog('success', 'USSD push sent! User should see prompt on phone.');
      setStep('pushed');
    } catch (err) {
      addLog('error', `Network error: ${err instanceof Error ? err.message : 'Unknown'}`);
      setStep('failed');
    }
  };

  // STEP 3: Start polling for payment status
  const startPolling = () => {
    setStep('polling');
    setPollCount(0);
    addLog('info', 'Started polling for payment status (every 3s, max 60 attempts)...');

    pollIntervalRef.current = setInterval(async () => {
      setPollCount((prev) => {
        const next = prev + 1;

        if (next >= 60) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          addLog('error', 'Polling timeout after 3 minutes');
          setStep('failed');
          return next;
        }

        // Do the actual poll
        pollStatus(next);
        return next;
      });
    }, 3000);
  };

  const pollStatus = async (attempt: number) => {
    try {
      const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();

      setPaymentStatus(data.status);

      if (data.status === 'completed') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        addLog('success', `Payment COMPLETED! (poll #${attempt})`);
        addLog('info', `CV ID: ${data.cvId}`);
        if (data.transactionId) addLog('info', `Transaction ID: ${data.transactionId}`);
        if (data.channel) addLog('info', `Channel: ${data.channel}`);
        setStep('completed');
      } else if (data.status === 'failed' || data.status === 'cancelled') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        addLog('error', `Payment ${data.status}: ${data.message}`);
        setStep('failed');
      } else if (attempt % 5 === 0) {
        // Log every 5th poll to avoid spam
        addLog('info', `Poll #${attempt}: ${data.status} — ${data.message}`);
      }
    } catch (err) {
      if (attempt % 5 === 0) {
        addLog('error', `Poll #${attempt} failed: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    addLog('info', 'Polling stopped manually');
    setStep('pushed');
  };

  // Manual status check
  const handleCheckStatus = async () => {
    addLog('request', `GET /api/payment/status?orderId=${orderId}`);

    try {
      const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();
      addLog('response', `Status ${res.status}`, data);
      setPaymentStatus(data.status);

      if (data.status === 'completed') {
        addLog('success', 'Payment is COMPLETED!');
        setStep('completed');
      }
    } catch (err) {
      addLog('error', `Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  };

  const handleReset = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setStep('idle');
    setLogs([]);
    setOrderId('');
    setCvId('');
    setMsisdn('');
    setPaymentStatus('');
    setPollCount(0);
  };

  const stepIcon = (s: Step) => {
    switch (s) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'initiating':
      case 'pushing':
      case 'polling': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Payment</h1>
          <p className="text-sm text-gray-500 mt-1">Test the full Selcom payment flow end-to-end</p>
        </div>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCw className="w-4 h-4" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-6">
          {/* Step Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 'initiated', label: '1. Create Order', desc: 'POST /api/payment/initiate' },
                  { id: 'pushed', label: '2. Push USSD', desc: 'POST /api/payment/push-ussd' },
                  { id: 'polling', label: '3. User Pays', desc: 'Waiting for M-Pesa PIN...' },
                  { id: 'completed', label: '4. Confirmed', desc: 'Webhook or poll confirms' },
                ].map((s, i) => {
                  const steps: Step[] = ['initiated', 'pushed', 'polling', 'completed'];
                  const currentIdx = steps.indexOf(step);
                  const thisIdx = i;
                  const isDone = currentIdx > thisIdx || step === 'completed';
                  const isCurrent = currentIdx === thisIdx;

                  return (
                    <div key={s.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isDone ? 'bg-green-100 text-green-700' :
                        isCurrent ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isCurrent ? 'text-gray-900' : isDone ? 'text-green-700' : 'text-gray-400'}`}>
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Input Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-gray-100 border rounded-md text-sm text-gray-600 shrink-0">
                    +255
                  </div>
                  <Input
                    type="tel"
                    placeholder="7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
                    disabled={step !== 'idle' && step !== 'failed'}
                  />
                </div>
                {phone.length >= 9 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Provider: {detectProvider(phone)} | MSISDN: {formatPhone(phone)}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={step !== 'idle' && step !== 'failed'}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={step !== 'idle' && step !== 'failed'}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold">TZS 5,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              {/* Step 1: Initiate */}
              <Button
                onClick={handleInitiate}
                disabled={!phone || phone.length < 9 || (step !== 'idle' && step !== 'failed')}
                className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 gap-2"
              >
                {step === 'initiating' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating Order...</>
                ) : (
                  <><Send className="w-4 h-4" /> Step 1: Create Order</>
                )}
              </Button>

              {/* Step 2: Push USSD */}
              <Button
                onClick={handlePushUSSD}
                disabled={step !== 'initiated'}
                variant={step === 'initiated' ? 'default' : 'outline'}
                className={`w-full gap-2 ${step === 'initiated' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              >
                {step === 'pushing' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending USSD...</>
                ) : (
                  <><Phone className="w-4 h-4" /> Step 2: Push USSD to Phone</>
                )}
              </Button>

              {/* Step 3: Poll */}
              {step === 'pushed' && (
                <Button
                  onClick={startPolling}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <ArrowRight className="w-4 h-4" /> Step 3: Start Polling for Payment
                </Button>
              )}

              {step === 'polling' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Polling... ({pollCount}/60)</span>
                    <StatusBadge status={paymentStatus || 'pending'} />
                  </div>
                  <Button onClick={stopPolling} variant="outline" className="w-full gap-2" size="sm">
                    Stop Polling
                  </Button>
                </div>
              )}

              {/* Manual check */}
              {orderId && step !== 'idle' && step !== 'initiating' && (
                <Button onClick={handleCheckStatus} variant="outline" className="w-full gap-2" size="sm">
                  <RotateCw className="w-4 h-4" /> Manual Status Check
                </Button>
              )}

              {/* Result */}
              {step === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-bold text-green-700">Payment Successful!</p>
                  <p className="text-sm text-green-600 mt-1">CV ID: {cvId}</p>
                  <p className="text-sm text-green-600">Order: {orderId}</p>
                </div>
              )}

              {step === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <XCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                  <p className="font-bold text-red-700">Payment Failed</p>
                  <p className="text-sm text-red-600 mt-1">Check logs below for details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current State */}
          {orderId && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Current State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-mono text-xs">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CV ID</span>
                    <span className="font-mono text-xs">{cvId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">MSISDN</span>
                    <span>{msisdn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Step</span>
                    <span className="flex items-center gap-1">{stepIcon(step)} {step}</span>
                  </div>
                  {paymentStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status</span>
                      <StatusBadge status={paymentStatus} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Live Logs */}
        <div>
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Live Logs</CardTitle>
                <span className="text-xs text-gray-400">{logs.length} entries</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 h-[600px] overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 ? (
                  <p className="text-gray-500">Enter a phone number and click &quot;Create Order&quot; to start...</p>
                ) : (
                  logs.map((log, i) => {
                    const colorMap = {
                      info: 'text-gray-400',
                      success: 'text-green-400',
                      error: 'text-red-400',
                      request: 'text-yellow-400',
                      response: 'text-cyan-400',
                    };
                    const prefixMap = {
                      info: 'INF',
                      success: ' OK',
                      error: 'ERR',
                      request: 'REQ',
                      response: 'RES',
                    };

                    return (
                      <div key={i} className={colorMap[log.type]}>
                        <span className="text-gray-600">[{log.time}]</span>{' '}
                        <span className="font-bold">[{prefixMap[log.type]}]</span>{' '}
                        {log.message}
                        {log.data != null && (
                          <pre className="text-gray-500 ml-4 mt-0.5 whitespace-pre-wrap break-all">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={logsEndRef} />
              </div>

              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-yellow-700">
                    <p className="font-medium">Testing notes:</p>
                    <ul className="mt-1 space-y-0.5 list-disc list-inside">
                      <li>Use a real phone number with M-Pesa/Airtel Money</li>
                      <li>The user will get a USSD push to enter their PIN</li>
                      <li>Webhook must be publicly accessible (use ngrok for local)</li>
                      <li>If webhook fails, polling will still detect completion</li>
                      <li>Amount: TZS 5,000 (real money in production!)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
