"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FileText, 
  Zap, 
  Smartphone, 
  Bot, 
  CheckCircle, 
  ArrowRight, 
  ChevronDown,
  Menu,
  X,
  Star,
  Clock,
  Award,
  Download
} from "lucide-react";

import airtelLogo from "@/assets/logos/airtel.png";
import azamPesaLogo from "@/assets/logos/azam-pesa.png";
import nmbLogo from "@/assets/logos/nmb.png";
import sportpesaLogo from "@/assets/logos/sportpesa.webp";
import amsonsLogo from "@/assets/logos/amsons.png";
import tanzaniaGovtLogo from "@/assets/logos/tanzania-govt.png";
import metlLogo from "@/assets/logos/metl.png";
import heroCvImage from "@/assets/hero-cv.png";

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
    icon: Zap,
    title: 'Haraka Sana',
    subtitle: 'Lightning Fast',
    description: 'Create a professional CV in under 5 minutes. No complicated forms, just simple steps.',
  },
  {
    icon: FileText,
    title: '35+ Templates',
    subtitle: 'Professional Designs',
    description: 'Recruiter-approved templates designed for the East African job market.',
  },
  {
    icon: Bot,
    title: 'AI-Powered',
    subtitle: 'Smart Suggestions',
    description: 'Get intelligent content suggestions tailored to your industry and role.',
  },
  {
    icon: CheckCircle,
    title: 'ATS-Friendly',
    subtitle: 'Beat the Bots',
    description: 'Our CVs pass Applicant Tracking Systems used by top employers.',
  },
  {
    icon: Download,
    title: 'PDF Download',
    subtitle: 'Professional Format',
    description: 'Download high-quality PDFs ready to send to any employer.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    subtitle: 'Create Anywhere',
    description: 'Build your CV from your phone, tablet, or computer - anytime, anywhere.',
  },
];

const steps = [
  { number: '01', title: 'Choose Template', description: 'Pick from 35+ professional designs', icon: FileText },
  { number: '02', title: 'Fill Your Details', description: 'AI helps you write compelling content', icon: Bot },
  { number: '03', title: 'Download & Apply', description: 'Get your professional CV instantly', icon: Download },
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
  { value: '50,000+', label: 'CVs Created', icon: FileText },
  { value: '35', label: 'Templates', icon: Star },
  { value: '3 min', label: 'Average Time', icon: Clock },
  { value: '4.9/5', label: 'User Rating', icon: Award },
];

const faqs = [
  {
    question: 'How much does it cost to create a CV?',
    answer: 'Creating and editing your CV is completely free. You only pay TZS 5,000 when you download the final PDF version.',
  },
  {
    question: 'Can I edit my CV after creating it?',
    answer: 'Yes! You can make unlimited edits to your CV before downloading. Your progress is saved automatically.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept M-Pesa, Tigo Pesa, Airtel Money, and other mobile money services popular in Tanzania.',
  },
  {
    question: 'Are the templates ATS-friendly?',
    answer: 'Yes, all our templates are designed to pass Applicant Tracking Systems (ATS) used by major employers.',
  },
  {
    question: 'Can I create a CV on my phone?',
    answer: 'Absolutely! CV Chap Chap is designed mobile-first, so you can create your CV from any device.',
  },
];

const trustedCompanies = [
  { name: 'Airtel', logo: airtelLogo },
  { name: 'Azam Pesa', logo: azamPesaLogo },
  { name: 'NMB Bank', logo: nmbLogo },
  { name: 'SportPesa', logo: sportpesaLogo },
  { name: 'Amsons Group', logo: amsonsLogo },
  { name: 'Tanzania Government', logo: tanzaniaGovtLogo },
  { name: 'MeTL Group', logo: metlLogo },
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen bg-white font-body overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-lg shadow-blue-900/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cv-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cv-blue-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                CV <span className="bg-gradient-to-r from-cv-blue-700 via-cv-blue-500 to-cv-blue-400 bg-clip-text text-transparent">Chap Chap</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-cv-blue-600 transition-colors font-medium">Features</a>
              <a href="#templates" className="text-gray-600 hover:text-cv-blue-600 transition-colors font-medium">Templates</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-cv-blue-600 transition-colors font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-cv-blue-600 transition-colors font-medium">Pricing</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth" className="px-4 py-2 text-gray-700 font-medium hover:text-cv-blue-600 transition-colors">
                Login
              </Link>
              <Link 
                href="/template" 
                className="px-6 py-2.5 bg-gradient-to-r from-cv-blue-600 to-cv-blue-500 text-white font-semibold rounded-full shadow-lg shadow-cv-blue-500/40 hover:shadow-cv-blue-500/50 hover:-translate-y-0.5 transition-all"
              >
                Create CV Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col gap-4 pt-4">
                <a href="#features" className="text-gray-600 hover:text-cv-blue-600 transition-colors font-medium">Features</a>
                <a href="#templates" className="text-gray-600 hover:text-cv-blue-600 transition-colors font-medium">Templates</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-cv-blue-600 transition-colors font-medium">How It Works</a>
                <a href="#pricing" className="text-gray-600 hover:text-cv-blue-600 transition-colors font-medium">Pricing</a>
                <Link 
                  href="/template" 
                  className="px-6 py-2.5 bg-gradient-to-r from-cv-blue-600 to-cv-blue-500 text-white font-semibold rounded-full text-center mt-2"
                >
                  Create CV Free
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cv-blue-50 via-cv-blue-100/50 to-white" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cv-blue-200 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-cv-blue-200 mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Made In Tanzania</span>
                <span className="text-xs">🇹🇿</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Create Your CV
                <span className="block bg-gradient-to-r from-cv-blue-700 via-cv-blue-500 to-cv-blue-400 bg-clip-text text-transparent">
                  in 3 Minutes
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
                Build a stunning CV that gets you noticed. AI-powered content suggestions, 
                35+ professional templates, and instant PDF download.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/create"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cv-blue-600 to-cv-blue-500 text-white font-semibold rounded-full shadow-lg shadow-cv-blue-500/40 hover:shadow-cv-blue-500/50 hover:-translate-y-0.5 transition-all text-lg"
                >
                  Create Your CV Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border border-gray-200 hover:border-cv-blue-300 hover:text-cv-blue-600 transition-all text-lg"
                >
                  See How It Works
                </a>
              </div>

              {/* Success stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-sm font-semibold text-green-700">30% higher chance of getting a job*</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-sm font-semibold text-green-700">42% higher response rate from recruiters*</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative animate-float">
                {/* Hero Image */}
                <div className="relative">
                  <Image
                    src={heroCvImage}
                    alt="Professional CV Example - Create your own CV"
                    width={550}
                    height={550}
                    className="w-full h-auto rounded-2xl"
                    priority
                  />
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ATS-Ready
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-3 animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cv-blue-500" />
                    <span className="text-sm font-medium">AI Suggestions</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-float">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Instant Download</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-12 bg-gradient-to-r from-cv-blue-600 to-cv-blue-500 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mobile: Horizontal scrolling */}
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-6 px-6">
            <motion.div 
              className="flex gap-8 min-w-max"
              animate={{ x: [0, -200, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...stats, ...stats].map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="text-center flex-shrink-0 px-4">
                  <stat.icon className="w-7 h-7 text-white/80 mx-auto mb-2" />
                  <div className="font-display text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-cv-blue-100 text-xs whitespace-nowrap">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-2" />
                <div className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-cv-blue-100 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-8">
            Professionals from these companies have created CVs with us
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {trustedCompanies.map((company) => (
              <div key={company.name} className="hover:scale-110 transition-all">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={100}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-cv-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-cv-blue-100 text-cv-blue-700 text-sm font-medium rounded-full mb-4">
                Simple & Fast
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Create Your CV in 3 Easy Steps
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform makes it quick and effortless to create a professional CV
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-cv-blue-400 via-cyan-400 to-cv-blue-200 rounded-full" />
                )}
                
                <div className="relative bg-white rounded-2xl p-6 shadow-xl shadow-cv-blue-100/50 border border-cv-blue-100 text-center hover:shadow-2xl hover:-translate-y-1 transition-all">
                  <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-cv-blue-500 to-cyan-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cv-blue-500/30">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-cv-blue-100 text-cv-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cv-blue-600 to-cv-blue-500 text-white font-semibold rounded-full shadow-lg shadow-cv-blue-500/40 hover:shadow-cv-blue-500/50 hover:-translate-y-0.5 transition-all text-lg"
            >
              Start Creating Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-cv-blue-100 text-cv-blue-700 text-sm font-medium rounded-full mb-4">
                Features
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Stand Out
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform is designed specifically for job seekers in East Africa
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cv-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-cv-blue-600 text-sm mb-2">{feature.subtitle}</p>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-cv-blue-100 text-cv-blue-700 text-sm font-medium rounded-full mb-4">
                Templates
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                35+ Professional Templates
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose from our collection of recruiter-approved designs
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {templates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className={`aspect-[3/4] bg-gradient-to-br ${template.color} rounded-xl shadow-lg group-hover:shadow-xl group-hover:-translate-y-2 transition-all relative overflow-hidden`}>
                  <div className="absolute inset-2 bg-white rounded-lg p-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mb-2" />
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="h-1.5 bg-gray-100 rounded" />
                      <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900 text-center">{template.name}</p>
                <p className="text-xs text-gray-500 text-center">{template.category}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/template"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cv-blue-600 to-cv-blue-500 text-white font-semibold rounded-full shadow-lg shadow-cv-blue-500/40 hover:shadow-cv-blue-500/50 hover:-translate-y-0.5 transition-all"
            >
              Browse All Templates
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-cv-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-cv-blue-100 text-cv-blue-700 text-sm font-medium rounded-full mb-4">
                Testimonials
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-xl text-center"
            >
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-gray-700 mb-6 italic">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cv-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonials[activeTestimonial].role} • {testimonials[activeTestimonial].location}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-cv-blue-500 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-cv-blue-100 text-cv-blue-700 text-sm font-medium rounded-full mb-4">
                Pricing
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Fair Pricing
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pay only when you download. No hidden fees, no subscriptions.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="relative bg-gradient-to-br from-cv-blue-600 to-cv-blue-500 rounded-3xl p-8 text-white overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="text-center mb-6">
                  <p className="text-cv-blue-100 text-sm mb-2">One-time payment</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg">TZS</span>
                    <span className="font-display text-6xl font-bold">5,000</span>
                  </div>
                  <p className="text-cv-blue-100 text-sm mt-2">per CV download</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    'Choose from 21+ professional templates',
                    'AI-powered content suggestions',
                    'Unlimited edits before download',
                    'High-quality PDF download',
                    'M-Pesa & mobile money payment',
                    'Instant delivery',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/template"
                  className="block w-full py-4 bg-white text-cv-blue-600 font-semibold rounded-full text-center hover:bg-gray-50 transition-colors"
                >
                  Start Creating Your CV
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-cv-blue-100 text-cv-blue-700 text-sm font-medium rounded-full mb-4">
                FAQ
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full bg-white rounded-xl p-6 text-left shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} />
                  </div>
                  {openFaq === index && (
                    <p className="mt-4 text-gray-600">{faq.answer}</p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cv-blue-600 to-cv-blue-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-cv-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have already created their professional CVs with CV Chap Chap
            </p>
            <Link 
              href="/template"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cv-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-50 transition-all text-lg"
            >
              Create Your CV Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cv-blue-500 to-cyan-400 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="font-display font-bold text-xl">CV Chap Chap</span>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                CV Chap Chap is a Tanzanian company revolutionizing job applications with AI-powered CV creation. We help job seekers across East Africa build professional CVs quickly and affordably.
              </p>
              <div className="flex gap-4">
                <span className="text-2xl">🇹🇿</span>
                <span className="text-gray-400">Made in Tanzania</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/template" className="hover:text-white transition-colors">Create CV</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Dar es Salaam, Tanzania</li>
                <li>info@cvchapchap.co.tz</li>
                <li>+255 xxx xxx xxx</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CV Chap Chap. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
