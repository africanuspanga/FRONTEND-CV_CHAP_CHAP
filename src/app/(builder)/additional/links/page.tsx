"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, Plus, Trash2, Link2, Globe, Linkedin, Github, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const getLinkIcon = (url: string) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
  if (lowerUrl.includes('github')) return <Github className="w-5 h-5" />;
  return <Globe className="w-5 h-5" />;
};

const getLinkName = (url: string) => {
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return hostname.replace('www.', '').split('.')[0];
  } catch {
    return url;
  }
};

export default function LinksPage() {
  const router = useRouter();
  const { cvData, addSocialLink, removeSocialLink } = useCVStore();
  const [formData, setFormData] = useState({
    url: '',
    showInHeader: false,
  });

  const socialLinks = cvData.socialLinks || [];

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-heading font-bold text-gray-900">Links & Profiles</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          {/* Info Card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-600 text-sm">
                Add links to your portfolio, LinkedIn, GitHub, or other professional profiles to help recruiters learn more about you.
              </p>
            </div>
          </div>

          {/* Existing Links */}
          {socialLinks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Your Links</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {socialLinks.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        link.url.toLowerCase().includes('linkedin')
                          ? 'bg-blue-50 text-blue-600'
                          : link.url.toLowerCase().includes('github')
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-purple-50 text-purple-600'
                      }`}>
                        {getLinkIcon(link.url)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 capitalize">{getLinkName(link.url)}</p>
                        <p className="text-xs text-gray-400 truncate">{link.url}</p>
                      </div>
                      {link.showInHeader && (
                        <span className="text-xs bg-cv-blue-50 text-cv-blue-600 px-2 py-1 rounded-full flex-shrink-0">
                          In Header
                        </span>
                      )}
                      <button
                        onClick={() => removeSocialLink(link.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Add New Form */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">
              {socialLinks.length > 0 ? 'Add Another Link' : 'Add Link'}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">URL</Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="h-12 pl-10 rounded-xl border-gray-200"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.showInHeader}
                  onChange={(e) => setFormData({ ...formData, showInHeader: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-cv-blue-600 focus:ring-cv-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Show in CV header</span>
                  <p className="text-xs text-gray-500">Display this link prominently at the top of your CV</p>
                </div>
              </label>

              {socialLinks.length > 0 && formData.url && (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 text-cv-blue-600 font-medium hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Add and continue adding
                </button>
              )}
            </div>
          </div>

          {/* Quick Add Suggestions */}
          {socialLinks.length === 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Popular platforms:</p>
              <div className="flex flex-wrap gap-2">
                {['LinkedIn', 'GitHub', 'Portfolio', 'Twitter/X', 'Behance'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setFormData({ ...formData, url: platform.toLowerCase().includes('linkedin') ? 'https://linkedin.com/in/' : `https://${platform.toLowerCase()}.com/` })}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-cv-blue-300 hover:text-cv-blue-600 transition-colors"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button
            onClick={handleSave}
            disabled={socialLinks.length === 0 && !formData.url}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold disabled:opacity-50"
          >
            {socialLinks.length === 0 && !formData.url ? 'Add a link first' : 'Save to CV'}
          </Button>
        </div>
      </div>
    </div>
  );
}
