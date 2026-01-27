'use client';

import { useState, useEffect } from 'react';

// ============================================
// CV CHAP CHAP V2 - LANDING PAGE
// ============================================
// 
// SETUP INSTRUCTIONS FOR YOUR FRONTEND DEVELOPER:
// 
// 1. Install dependencies:
//    npm install framer-motion lucide-react
//
// 2. Add Google Fonts to your _document.js or layout.tsx:
//    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
//
// 3. If using Next.js App Router, add 'use client' at the top (already included)
//
// 4. Import and use: <CVChapChapLanding />
//
// 5. Tailwind CSS required - ensure your tailwind.config.js includes:
//    theme: {
//      extend: {
//        fontFamily: {
//          'display': ['Space Grotesk', 'sans-serif'],
//          'body': ['Plus Jakarta Sans', 'sans-serif'],
//        },
//        colors: {
//          'cv-blue': {
//            50: '#eff8ff',
//            100: '#dbeefe',
//            200: '#bfe3fe',
//            300: '#93d3fd',
//            400: '#60bbfa',
//            500: '#3b9df6',
//            600: '#2580eb',
//            700: '#1d69d8',
//            800: '#1e55af',
//            900: '#1e498a',
//          },
//          'cv-dark': '#0a1628',
//          'cv-navy': '#0f2847',
//        }
//      }
//    }
// ============================================

const CVChapChapLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const templates = [
    { name: 'Professional', color: 'from-blue-500 to-cyan-400', category: 'Corporate' },
    { name: 'Modern', color: 'from-indigo-500 to-blue-400', category: 'Tech' },
    { name: 'Creative', color: 'from-cyan-400 to-teal-400', category: 'Design' },
    { name: 'Executive', color: 'from-slate-600 to-slate-400', category: 'Leadership' },
    { name: 'Minimalist', color: 'from-gray-400 to-gray-300', category: 'Clean' },
    { name: 'Bold', color: 'from-blue-600 to-indigo-500', category: 'Standout' },
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Haraka Sana',
      subtitle: 'Lightning Fast',
      description: 'Create a professional CV in under 5 minutes. No complicated forms, just simple steps.',
    },
    {
      icon: '🎨',
      title: '21+ Templates',
      subtitle: 'Professional Designs',
      description: 'Recruiter-approved templates designed for the East African job market.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      subtitle: 'Smart Suggestions',
      description: 'Get intelligent content suggestions tailored to your industry and role.',
    },
    {
      icon: '📱',
      title: 'M-Pesa Ready',
      subtitle: 'Easy Payment',
      description: 'Pay conveniently with M-Pesa. Download your CV instantly after payment.',
    },
    {
      icon: '✅',
      title: 'ATS-Friendly',
      subtitle: 'Beat the Bots',
      description: 'Our CVs pass Applicant Tracking Systems used by top employers.',
    },
    {
      icon: '📄',
      title: 'PDF Download',
      subtitle: 'Professional Format',
      description: 'Download high-quality PDFs ready to send to any employer.',
    },
  ];

  const steps = [
    { number: '01', title: 'Choose Template', description: 'Pick from 21+ professional designs' },
    { number: '02', title: 'Fill Your Details', description: 'AI helps you write compelling content' },
    { number: '03', title: 'Pay via M-Pesa', description: 'Quick, secure mobile payment' },
    { number: '04', title: 'Download PDF', description: 'Get your CV instantly' },
  ];

  const testimonials = [
    {
      name: 'Amina Hassan',
      role: 'Marketing Manager',
      location: 'Dar es Salaam',
      text: 'CV Chap Chap helped me land my dream job! The templates are modern and the process was so simple.',
      avatar: 'AH',
    },
    {
      name: 'Joseph Kimaro',
      role: 'Software Developer',
      location: 'Arusha',
      text: 'Finally, a CV builder that understands the Tanzanian market. M-Pesa payment made it so convenient!',
      avatar: 'JK',
    },
    {
      name: 'Grace Mwangi',
      role: 'Finance Analyst',
      location: 'Mwanza',
      text: 'I created my CV in just 10 minutes. The AI suggestions were incredibly helpful for my experience section.',
      avatar: 'GM',
    },
  ];

  const stats = [
    { value: '50,000+', label: 'CVs Created' },
    { value: '21', label: 'Templates' },
    { value: '5 min', label: 'Average Time' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen bg-white font-body overflow-x-hidden">
      {/* Custom Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 157, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 157, 246, 0.6); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite; animation-delay: 2s; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-slide-up-delayed { animation: slide-up 0.8s ease-out forwards; animation-delay: 0.2s; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        
        .mesh-gradient {
          background: 
            radial-gradient(at 40% 20%, rgba(59, 157, 246, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(96, 187, 250, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(147, 211, 253, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgba(37, 128, 235, 0.08) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(59, 157, 246, 0.1) 0px, transparent 50%);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #1d69d8 0%, #3b9df6 50%, #60bbfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #eff8ff 0%, #dbeefe 25%, #bfe3fe 50%, #eff8ff 100%);
        }
        
        .cv-preview-shadow {
          box-shadow: 
            0 25px 50px -12px rgba(30, 85, 175, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #2580eb 0%, #3b9df6 100%);
          box-shadow: 0 4px 14px rgba(37, 128, 235, 0.4);
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 128, 235, 0.5);
        }
        
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-lg shadow-blue-900/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                CV <span className="text-gradient">Chap Chap</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#templates" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Templates</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors">
                Login
              </button>
              <button className="btn-primary px-6 py-2.5 text-white font-semibold rounded-full">
                Create CV Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col gap-4 pt-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
                <a href="#templates" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Templates</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">How It Works</a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</a>
                <button className="btn-primary px-6 py-2.5 text-white font-semibold rounded-full mt-2">
                  Create CV Free
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen hero-gradient overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 noise-overlay pointer-events-none" />
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Column - Content */}
            <div className="animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg shadow-blue-900/5 mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  🇹🇿 Made for Tanzania
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Build Your CV
                <br />
                <span className="text-gradient">Chap Chap!</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Land your dream job with East Africa's smartest CV builder. 
                Create professional, ATS-friendly CVs in minutes — pay with M-Pesa.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="btn-primary px-8 py-4 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 group">
                  <span>Create My CV</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Import Existing CV</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-indigo-500'].map((bg, i) => (
                      <div key={i} className={`w-8 h-8 ${bg} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">50K+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 font-medium ml-1">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Right Column - CV Preview */}
            <div className="relative animate-slide-in-right">
              {/* Main CV Card */}
              <div className="relative z-10 bg-white rounded-3xl cv-preview-shadow p-8 animate-float">
                {/* CV Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    JM
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-900">John Makundi</h3>
                    <p className="text-blue-600 font-medium">Software Engineer</p>
                    <p className="text-gray-500 text-sm">Dar es Salaam, Tanzania</p>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Professional Summary</h4>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-100 rounded-full w-full" />
                    <div className="h-2 bg-gray-100 rounded-full w-5/6" />
                    <div className="h-2 bg-gray-100 rounded-full w-4/6" />
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Experience</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Senior Developer</p>
                        <p className="text-gray-500 text-xs">Vodacom Tanzania • 2021-Present</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Full Stack Developer</p>
                        <p className="text-gray-500 text-xs">Selcom • 2019-2021</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'AWS', 'M-Pesa API'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-pulse-glow z-20">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Get hired</p>
                    <p className="font-bold text-green-600">2x faster</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">AI-Powered</p>
                    <p className="font-bold text-gray-900">Smart Writing</p>
                  </div>
                </div>
              </div>

              {/* Background Card */}
              <div className="absolute top-8 left-8 w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl -z-10 transform rotate-3" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-gray-500 font-medium">Scroll to explore</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Create Your CV in <span className="text-gradient">4 Easy Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No complicated forms. No confusing options. Just a simple, fast process to get you hired.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent z-0" />
                )}
                
                <div className="relative z-10 bg-white rounded-3xl p-8 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 transition-all group">
                  <div className="font-display text-6xl font-bold text-blue-100 group-hover:text-blue-200 transition-colors mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn-primary px-8 py-4 text-white font-bold text-lg rounded-2xl">
              Start Building Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
              Powerful Features
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-gradient">Get Hired</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for East African job seekers. Modern features, local payment methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-blue-600 font-medium text-sm mb-3">{feature.subtitle}</p>
                <p className="text-gray-600">{feature.description}</p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              21+ Templates
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Professional Templates for <span className="text-gradient">Every Career</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From creative to corporate, find the perfect design for your industry.
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {templates.map((template, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all cursor-pointer"
              >
                {/* Template Preview */}
                <div className={`h-64 bg-gradient-to-br ${template.color} relative`}>
                  <div className="absolute inset-4 bg-white rounded-2xl shadow-xl p-4">
                    {/* Mini CV Preview */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-2 w-16 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-gray-100 rounded" />
                      <div className="h-2 w-5/6 bg-gray-100 rounded" />
                      <div className="h-2 w-4/6 bg-gray-100 rounded" />
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold transform scale-90 group-hover:scale-100 transition-transform">
                      Use Template
                    </button>
                  </div>
                </div>
                
                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-gray-900">{template.name}</h3>
                      <p className="text-gray-500 text-sm">{template.category}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-colors">
              View All 21 Templates
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              Success Stories
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-gradient">50,000+ Tanzanians</span>
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 transform transition-all duration-500 ${
                  activeTestimonial === index ? 'scale-105 shadow-xl' : 'scale-100'
                }`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeTestimonial === index ? 'bg-blue-500 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              Simple Pricing
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Affordable for <span className="text-gradient">Everyone</span>
            </h2>
            <p className="text-xl text-gray-600">
              One simple price. No hidden fees. Pay with M-Pesa.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center">
              <h3 className="font-display text-2xl font-bold text-white mb-2">CV Download</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="font-display text-6xl font-bold text-white">5,000</span>
                <span className="text-blue-100 text-xl">TZS</span>
              </div>
              <p className="text-blue-100 mt-2">One-time payment per CV</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4 mb-8">
                {[
                  'Access to all 21+ templates',
                  'AI-powered content suggestions',
                  'ATS-friendly formatting',
                  'PDF download',
                  'Edit anytime before download',
                  'M-Pesa payment',
                  '24/7 customer support',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full btn-primary py-4 text-white font-bold text-lg rounded-2xl">
                Create My CV Now
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                ✨ Free to create • Only pay when you download
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Is CV Chap Chap free to use?',
                a: 'Yes! Creating and editing your CV is completely free. You only pay TZS 5,000 when you want to download the final PDF.',
              },
              {
                q: 'How do I pay for my CV?',
                a: 'We accept M-Pesa payments for your convenience. Simply enter your phone number and confirm the payment on your phone.',
              },
              {
                q: 'Are the templates ATS-friendly?',
                a: 'Absolutely! All our templates are designed to pass Applicant Tracking Systems (ATS) used by major employers.',
              },
              {
                q: 'Can I edit my CV after creating it?',
                a: 'Yes, you can edit your CV as many times as you want before downloading. Your progress is automatically saved.',
              },
              {
                q: 'How long does it take to create a CV?',
                a: 'Most users complete their CV in under 5 minutes. Our AI suggestions help you write content quickly.',
              },
            ].map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-10" />
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 50,000+ Tanzanians who have already created professional CVs with CV Chap Chap.
          </p>
          <button className="px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-blue-50 transition-colors shadow-xl shadow-blue-900/30">
            Create My CV Now — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-display font-bold text-xl text-white">CV Chap Chap</span>
              </div>
              <p className="text-gray-500 mb-4">
                East Africa's smartest CV builder. Build professional CVs, land better jobs.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">CV Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>📧 xxxxx@xxxxx.com</li>
                <li>📱 +255 xxx xxx xxx</li>
                <li>📍 Dar es Salaam, Tanzania</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500">© 2025 CV Chap Chap. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CVChapChapLanding;
