"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, Plus, Trash2, Award, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

export default function CertificationsPage() {
  const router = useRouter();
  const { cvData, addCertification, removeCertification } = useCVStore();
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
  });

  const certifications = cvData.certifications || [];

  const handleBack = () => {
    router.push('/additional');
  };

  const handleAdd = () => {
    if (formData.name) {
      addCertification(formData);
      setFormData({ name: '', issuer: '', date: '' });
    }
  };

  const handleSave = () => {
    if (formData.name) {
      addCertification(formData);
    }
    router.push('/additional');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthName = MONTHS.find(m => m.value === month)?.label || '';
    return monthName ? `${monthName} ${year}` : year;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-heading font-bold text-gray-900">Certifications</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          {/* Info Card */}
          <div className="bg-gradient-to-r from-cv-blue-50 to-cyan-50 rounded-2xl p-4 mb-6 border border-cv-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cv-blue-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-cv-blue-600" />
              </div>
              <p className="text-gray-600 text-sm">
                Elevate your CV with noteworthy credentials that prove you are an expert in your field.
              </p>
            </div>
          </div>

          {/* Existing Certifications */}
          <AnimatePresence>
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      {cert.issuer && <p className="text-sm text-gray-600">{cert.issuer}</p>}
                      {cert.date && (
                        <p className="text-xs text-gray-400 mt-1">{formatDate(cert.date)}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add New Form */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              {certifications.length > 0 ? 'Add Another Certification' : 'Add Certification'}
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Certificate/License Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., AWS Certified Cloud Practitioner"
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Issuing Organization</Label>
                <Input
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Date of Completion</Label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <select
                      value={formData.date.split('-')[1] || ''}
                      onChange={(e) => {
                        const year = formData.date.split('-')[0] || '';
                        setFormData({ ...formData, date: year ? `${year}-${e.target.value}` : '' });
                      }}
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-3 text-gray-900 appearance-none cursor-pointer hover:border-cv-blue-300 focus:border-cv-blue-500 focus:ring-2 focus:ring-cv-blue-500/20 transition-colors"
                    >
                      <option value="">Month</option>
                      {MONTHS.map((month) => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="flex-1 relative">
                    <select
                      value={formData.date.split('-')[0] || ''}
                      onChange={(e) => {
                        const month = formData.date.split('-')[1] || '01';
                        setFormData({ ...formData, date: e.target.value ? `${e.target.value}-${month}` : '' });
                      }}
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-3 text-gray-900 appearance-none cursor-pointer hover:border-cv-blue-300 focus:border-cv-blue-500 focus:ring-2 focus:ring-cv-blue-500/20 transition-colors"
                    >
                      <option value="">Year</option>
                      {YEARS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {certifications.length > 0 && formData.name && (
              <button
                onClick={handleAdd}
                className="mt-4 flex items-center gap-2 text-cv-blue-600 font-medium hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add and continue adding
              </button>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button
            onClick={handleSave}
            disabled={certifications.length === 0 && !formData.name}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold disabled:opacity-50"
          >
            {certifications.length === 0 && !formData.name ? 'Add a certification first' : 'Save to CV'}
          </Button>
        </div>
      </div>
    </div>
  );
}
