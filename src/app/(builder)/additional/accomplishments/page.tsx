"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccomplishmentsPage() {
  const router = useRouter();
  const { cvData, addAccomplishment, removeAccomplishment } = useCVStore();
  const [description, setDescription] = useState('');

  const accomplishments = cvData.accomplishments || [];

  const handleBack = () => {
    router.push('/additional');
  };

  const handleAdd = () => {
    if (description.trim()) {
      addAccomplishment({ description: description.trim() });
      setDescription('');
    }
  };

  const handleSave = () => {
    if (description.trim()) {
      addAccomplishment({ description: description.trim() });
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
          <h1 className="text-lg font-heading font-bold text-gray-900">Accomplishments</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          <p className="text-gray-600 mb-6">
            Did you receive awards, exceed targets, earn a leadership role or achieve recognition of some sort?
          </p>

          <AnimatePresence>
            {accomplishments.map((acc) => (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4"
              >
                <div className="flex items-start justify-between">
                  <p className="text-gray-800 flex-1">{acc.description}</p>
                  <button
                    onClick={() => removeAccomplishment(acc.id)}
                    className="text-red-500 hover:text-red-700 ml-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include anything you've authored or co-authored. For example: a brand logo project, a best selling book"
              className="min-h-[150px] text-base border-0 focus:ring-0 resize-none"
            />
            <div className="border-t pt-3 flex items-center gap-4 text-gray-400">
              <button className="font-bold hover:text-gray-600">B</button>
              <button className="italic hover:text-gray-600">I</button>
              <button className="underline hover:text-gray-600">U</button>
              <button className="hover:text-gray-600">≡</button>
              <button className="hover:text-gray-600">↺</button>
              <button className="hover:text-gray-600">↻</button>
            </div>
          </div>

          {accomplishments.length > 0 && (
            <button
              onClick={handleAdd}
              disabled={!description.trim()}
              className="flex items-center gap-2 text-cv-blue-600 font-medium hover:underline disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
              Add another accomplishment
            </button>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleSave}
            disabled={accomplishments.length === 0 && !description.trim()}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl disabled:opacity-50"
          >
            Add to CV
          </Button>
        </div>
      </div>
    </div>
  );
}
