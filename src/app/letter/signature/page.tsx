'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLetterStore } from '@/stores/letter-store';
import { SIGNATURE_FONTS } from '@/types/letter';
import { generateLetterBody } from '@/lib/letter/generate-body';
import { StepHeader } from '@/components/builder/step-header';
import { ArrowRight, Type, PenTool, Trash2 } from 'lucide-react';

export default function LetterSignaturePage() {
  const router = useRouter();
  const { letterData, updateSignature, setParagraphs, setDate } = useLetterStore();

  const [mode, setMode] = useState<'type' | 'draw'>(letterData.signature.mode);
  const [fontFamily, setFontFamily] = useState(letterData.signature.fontFamily);
  const [dataUrl, setDataUrl] = useState(letterData.signature.dataUrl);

  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (mode !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1a1a1a';

    // Restore existing drawing if any
    if (dataUrl) {
      const img = new window.Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = dataUrl;
    }
  }, [mode, dataUrl]);

  const getPoint = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  }, []);

  const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPoint.current = getPoint(e);
  }, [getPoint]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const point = getPoint(e);
    if (!point || !lastPoint.current) return;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
  }, [getPoint]);

  const endDraw = useCallback(() => {
    isDrawing.current = false;
    lastPoint.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      setDataUrl(canvas.toDataURL('image/png'));
    }
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setDataUrl('');
  }, []);

  const handleContinue = () => {
    updateSignature({ mode, fontFamily, dataUrl });

    // Generate paragraphs and set date
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    setDate(dateStr);

    const updatedData = {
      ...letterData,
      signature: { mode, fontFamily, dataUrl },
      date: dateStr,
    };
    const paragraphs = generateLetterBody(updatedData);
    setParagraphs(paragraphs);

    router.push('/letter/preview');
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      <StepHeader
        currentStep={4}
        totalSteps={5}
        title="Signature"
        backPath="/letter/strengths"
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Mode Toggle */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('type')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'type'
                  ? 'bg-white text-cv-blue-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <Type className="h-4 w-4" />
              Type
            </button>
            <button
              onClick={() => setMode('draw')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'draw'
                  ? 'bg-white text-cv-blue-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <PenTool className="h-4 w-4" />
              Draw
            </button>
          </div>

          {mode === 'type' ? (
            <>
              {/* Signature Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 min-h-[120px] flex items-center justify-center">
                <p
                  style={{ fontFamily }}
                  className="text-4xl text-gray-800"
                >
                  {letterData.sender.name || 'Your Name'}
                </p>
              </div>

              {/* Font Selector */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Choose a signature font</p>
                <div className="space-y-2">
                  {SIGNATURE_FONTS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setFontFamily(font.family)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        fontFamily === font.family
                          ? 'border-cv-blue-500 bg-cv-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span
                        style={{ fontFamily: font.family }}
                        className="text-2xl text-gray-800"
                      >
                        {letterData.sender.name || 'Your Name'}
                      </span>
                      <span className="block text-xs text-gray-400 mt-1">{font.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Draw Canvas */}
              <div className="relative">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full touch-none"
                    style={{ height: '200px' }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                  />
                  {/* Guide line */}
                  <div className="absolute bottom-12 left-6 right-6 border-b border-dashed border-gray-300" />
                </div>
                <button
                  onClick={clearCanvas}
                  className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
              </div>

              <p className="text-center text-sm text-gray-400">
                Use your finger or mouse to draw your signature
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t p-4"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 text-white font-semibold py-3.5 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            Preview Letter
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
