'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, Edit, Download, Trash2, LogOut } from 'lucide-react';

interface CVWithPayment {
  id: string;
  title: string | null;
  template_id: string;
  data: any;
  status: string;
  created_at: string;
  updated_at: string;
  download_count: number;
  payments: Array<{
    status: string;
    completed_at: string | null;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const [cvs, setCVs] = useState<CVWithPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchCVs = async () => {
      if (!user) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('cvs')
        .select(`
          *,
          payments (status, completed_at)
        `)
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching CVs:', error);
      } else {
        setCVs(data || []);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchCVs();
    }
  }, [user]);

  const handleDownload = async (cvId: string) => {
    const cv = cvs.find(c => c.id === cvId);
    const isPaid = cv?.payments?.some(p => p.status === 'completed');

    if (isPaid) {
      window.location.href = `/api/pdf/generate?cvId=${cvId}`;
    } else {
      router.push(`/payment?cvId=${cvId}`);
    }
  };

  const handleEdit = (cvId: string) => {
    router.push(`/builder?cvId=${cvId}`);
  };

  const handleDelete = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;

    const supabase = createClient();
    await supabase
      .from('cvs')
      .update({ is_deleted: true })
      .eq('id', cvId);

    setCVs(cvs.filter(cv => cv.id !== cvId));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cv-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cv-blue-500 to-cyan-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-cv-blue-600">CV Chap Chap</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile?.full_name || profile?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My CVs</h1>
            <p className="text-gray-600 mt-1">
              {cvs.length === 0 
                ? "You haven't created any CVs yet" 
                : `You have ${cvs.length} CV${cvs.length > 1 ? 's' : ''}`
              }
            </p>
          </div>
          <Button onClick={() => router.push('/template')} className="bg-cv-blue-600 hover:bg-cv-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New CV
          </Button>
        </div>

        {cvs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-cv-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-cv-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Create Your First CV
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Choose from 21 professional templates, fill in your details, 
              and download your polished CV in minutes.
            </p>
            <Button onClick={() => router.push('/template')} size="lg" className="bg-cv-blue-600 hover:bg-cv-blue-700">
              Get Started →
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => {
              const isPaid = cv.payments?.some(p => p.status === 'completed');
              const cvTitle = cv.title || `${cv.data?.personalInfo?.firstName || 'Untitled'}'s CV`;

              return (
                <Card key={cv.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[210/297] bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-gray-300" />
                    </div>

                    <div className="absolute top-3 right-3">
                      {isPaid ? (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          ✓ Owned
                        </span>
                      ) : (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleEdit(cv.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleDownload(cv.id)}
                        className={isPaid ? 'bg-green-600 hover:bg-green-700' : 'bg-cv-blue-600 hover:bg-cv-blue-700'}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {isPaid ? 'Download' : 'Pay & Download'}
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{cvTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Updated {new Date(cv.updated_at).toLocaleDateString()}
                    </p>
                    {isPaid && cv.download_count > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Downloaded {cv.download_count} time{cv.download_count > 1 ? 's' : ''}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <button 
                        onClick={() => handleEdit(cv.id)}
                        className="text-sm text-cv-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(cv.id)}
                        className="text-sm text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
