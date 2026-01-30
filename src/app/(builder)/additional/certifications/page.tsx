"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificationsPage() {
  const router = useRouter();
  const { cvData, addCertification, updateCertification, removeCertification } = useCVStore();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
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
          <p className="text-gray-600 mb-6">
            Elevate your CV with noteworthy credentials that prove you are an expert in your field.
          </p>

          <AnimatePresence>
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    {cert.date && (
                      <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700">Certificate/License Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., AWS Certified Cloud Practitioner"
                  className="h-12 mt-1.5"
                />
              </div>

              <div>
                <Label className="text-gray-700">Issuing Organization</Label>
                <Input
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                  className="h-12 mt-1.5"
                />
              </div>

              <div>
                <Label className="text-gray-700">Date of Completion</Label>
                <Input
                  type="month"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-12 mt-1.5"
                />
              </div>
            </div>
          </div>

          {certifications.length > 0 && (
            <button
              onClick={handleAdd}
              disabled={!formData.name}
              className="flex items-center gap-2 text-cv-blue-600 font-medium hover:underline disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
              Add another certification
            </button>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleSave}
            disabled={certifications.length === 0 && !formData.name}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl disabled:opacity-50"
          >
            Add to CV
          </Button>
        </div>
      </div>
    </div>
  );
}
