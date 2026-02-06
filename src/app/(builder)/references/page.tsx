"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVStore } from "@/stores/cv-store";
import { ArrowRight, Plus, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { COMPANIES, JOB_TITLES } from "@/data/autocomplete";
import { StepHeader } from "@/components/builder/step-header";

const MAX_REFERENCES = 2;

export default function ReferencesPage() {
  const router = useRouter();
  const { cvData, addReference, updateReference, removeReference, setCurrentStep } = useCVStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
  });

  const handleBack = () => {
    setCurrentStep('summary');
    router.push('/summary');
  };

  const handleContinue = () => {
    setCurrentStep('additional');
    router.push('/additional');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      company: '',
      phone: '',
      email: '',
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.company) return;
    
    if (editingId) {
      updateReference(editingId, formData);
    } else {
      addReference(formData);
    }
    resetForm();
  };

  const handleEdit = (ref: typeof cvData.references[0]) => {
    setFormData({
      name: ref.name,
      title: ref.title,
      company: ref.company,
      phone: ref.phone,
      email: ref.email,
    });
    setEditingId(ref.id);
  };

  const handleDelete = (id: string) => {
    removeReference(id);
    if (editingId === id) {
      resetForm();
    }
  };

  const canAddMore = cvData.references.length < MAX_REFERENCES;

  return (
    <div className="min-h-screen bg-gray-50">
      <StepHeader
        currentStep={6}
        totalSteps={8}
        title="References"
        onBack={handleBack}
      />

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Professional References
            </h2>
            <p className="text-gray-600">
              Add up to {MAX_REFERENCES} professional references who can vouch for your work.
            </p>
          </div>

          {cvData.references.length > 0 && (
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {cvData.references.map((ref) => (
                  <motion.div
                    key={ref.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-cv-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-cv-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{ref.name}</h3>
                          <p className="text-sm text-gray-600">{ref.title} at {ref.company}</p>
                          <p className="text-sm text-gray-500 mt-1">{ref.phone} | {ref.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(ref)}
                          className="text-cv-blue-600 text-sm font-medium hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ref.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {(canAddMore || editingId) && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Reference' : `Add Reference ${cvData.references.length + 1}`}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Full Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Mwangi"
                    className="h-12 mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-gray-700">Job Title *</Label>
                  <div className="mt-1.5">
                    <AutocompleteInput
                      id="ref-title"
                      value={formData.title}
                      onChange={(value) => setFormData({ ...formData, title: value })}
                      suggestions={JOB_TITLES}
                      placeholder="Manager"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700">Company *</Label>
                  <div className="mt-1.5">
                    <AutocompleteInput
                      id="ref-company"
                      value={formData.company}
                      onChange={(value) => setFormData({ ...formData, company: value })}
                      suggestions={COMPANIES}
                      placeholder="ABC Company Ltd"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700">Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+255 XXX XXX XXX"
                    className="h-12 mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="h-12 mt-1.5"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={!formData.name || !formData.company}
                    className="flex-1 bg-cv-blue-600 hover:bg-cv-blue-700"
                  >
                    {editingId ? 'Update' : 'Add Reference'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {cvData.references.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              References are optional but recommended for a stronger CV
            </p>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
          >
            Next: Additional Sections
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
