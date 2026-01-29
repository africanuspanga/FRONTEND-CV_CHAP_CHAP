"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinksPage() {
  const router = useRouter();
  const { cvData, addSocialLink, updateSocialLink, removeSocialLink } = useCVStore();
  const [formData, setFormData] = useState({
    url: '',
    showInHeader: false,
  });

  const handleBack = () => {
    router.push('/additional');
  };

  const handleAdd = () => {
    if (formData.url) {
      addSocialLink(formData);
      setFormData({ url: '', showInHeader: false });
    }
  };

  const handleSave = () => {
    if (formData.url) {
      addSocialLink(formData);
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
          <h1 className="text-lg font-heading font-bold text-gray-900">Websites and Social Links</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          <p className="text-gray-600 mb-6">
            Including links to a portfolio or professional profiles helps recruiters see different dimensions of you.
          </p>

          <AnimatePresence>
            {cvData.socialLinks.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 break-all">{link.url}</p>
                    {link.showInHeader && (
                      <p className="text-xs text-cv-blue-600 mt-1">Shown in CV header</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeSocialLink(link.id)}
                    className="text-red-500 hover:text-red-700 ml-3"
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
                <Label className="text-gray-700">Link / URL</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="e.g. Linkedin, GitHub, Portfolio"
                  className="h-12 mt-1.5"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={formData.showInHeader}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, showInHeader: checked === true })
                  }
                />
                <span className="text-sm text-gray-700">Show in CV header</span>
              </label>
            </div>
          </div>

          {cvData.socialLinks.length > 0 && (
            <button
              onClick={handleAdd}
              disabled={!formData.url}
              className="flex items-center gap-2 text-cv-blue-600 font-medium hover:underline disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
              Add another link
            </button>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleSave}
            disabled={cvData.socialLinks.length === 0 && !formData.url}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl disabled:opacity-50"
          >
            Add to CV
          </Button>
        </div>
      </div>
    </div>
  );
}
