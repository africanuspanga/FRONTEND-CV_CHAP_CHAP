"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOP_LANGUAGES = [
  'English',
  'Swahili',
  'French',
  'Arabic',
  'Portuguese',
  'Chinese (Mandarin)',
  'Hindi',
  'Spanish',
  'German',
  'Amharic',
  'Hausa',
  'Yoruba',
  'Igbo',
  'Zulu',
  'Somali',
];

const PROFICIENCY_LEVELS = [
  { value: 'basic', label: 'Elementary' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'native', label: 'Native / Bilingual' },
] as const;

type ProficiencyLevel = typeof PROFICIENCY_LEVELS[number]['value'];

export default function LanguagesPage() {
  const router = useRouter();
  const { cvData, addLanguage, updateLanguage, removeLanguage } = useCVStore();
  const [newLanguage, setNewLanguage] = useState<{ name: string; proficiency: ProficiencyLevel }>({ name: '', proficiency: 'basic' });

  const languages = cvData.languages || [];

  const handleBack = () => {
    router.push('/additional');
  };

  const handleAddLanguage = () => {
    if (newLanguage.name) {
      const exists = languages.some(
        l => l.name.toLowerCase() === newLanguage.name.toLowerCase()
      );
      if (!exists) {
        addLanguage({ name: newLanguage.name, proficiency: newLanguage.proficiency });
      }
      setNewLanguage({ name: '', proficiency: 'basic' });
    }
  };

  const handleSave = () => {
    router.push('/additional');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-heading font-bold text-gray-900">Languages</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          <p className="text-gray-600 mb-6">
            If you are proficient in one or more languages, mention them in this section.
          </p>

          <AnimatePresence>
            {languages.map((lang) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-gray-300" />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Language</Label>
                      <Select
                        value={lang.name}
                        onValueChange={(value) => updateLanguage(lang.id, { name: value })}
                      >
                        <SelectTrigger className="h-10 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TOP_LANGUAGES.map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Proficiency</Label>
                      <Select
                        value={lang.proficiency}
                        onValueChange={(value: typeof PROFICIENCY_LEVELS[number]['value']) => 
                          updateLanguage(lang.id, { proficiency: value })
                        }
                      >
                        <SelectTrigger className="h-10 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFICIENCY_LEVELS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <button
                    onClick={() => removeLanguage(lang.id)}
                    className="text-cv-blue-500 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-gray-300 invisible" />
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Language</Label>
                  <Select
                    value={newLanguage.name}
                    onValueChange={(value) => setNewLanguage({ ...newLanguage, name: value })}
                  >
                    <SelectTrigger className="h-10 mt-1">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOP_LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Proficiency</Label>
                  <Select
                    value={newLanguage.proficiency}
                    onValueChange={(value: typeof PROFICIENCY_LEVELS[number]['value']) => 
                      setNewLanguage({ ...newLanguage, proficiency: value })
                    }
                  >
                    <SelectTrigger className="h-10 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-5"></div>
            </div>
          </div>

          <button
            onClick={handleAddLanguage}
            disabled={!newLanguage.name}
            className="flex items-center gap-2 text-cv-blue-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            Add another language
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleSave}
            disabled={languages.length === 0 && !newLanguage.name}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl disabled:opacity-50"
          >
            Add to CV
          </Button>
        </div>
      </div>
    </div>
  );
}
