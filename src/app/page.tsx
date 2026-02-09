"use client";

import { useState, useEffect, useRef } from "react";
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
  Download
} from "lucide-react";
import { TemplatePreview } from "@/components/templates/preview";
import { sampleCVData } from "@/lib/sample-data";
import { TEMPLATES } from "@/types/templates";

import airtelLogo from "@/assets/logos/airtel.png";
import azamPesaLogo from "@/assets/logos/azam-pesa.png";
import nmbLogo from "@/assets/logos/nmb.png";
import sportpesaLogo from "@/assets/logos/sportpesa.webp";
import amsonsLogo from "@/assets/logos/amsons.png";
import tanzaniaGovtLogo from "@/assets/logos/tanzania-govt.png";
import metlLogo from "@/assets/logos/metl.png";


// Select 6 templates to showcase on homepage (mix of styles)
const homeTemplateIds = ['charles', 'kathleen', 'grace-mint', 'classic-elegant', 'hexagon-blue', 'creative-yellow'];
const homeTemplates = TEMPLATES.filter(t => homeTemplateIds.includes(t.id));

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
    name: 'Madeline Sirikwa',
    role: 'Project Coordinator',
    location: 'Dar es Salaam',
    text: 'Got a call for an interview and they needed my CV urgently. Made one in under 3 minutes and sent it right away. Got the job!',
    avatar: 'MS',
  },
  {
    name: 'Lucy Mdema',
    role: 'Sales Executive',
    location: 'Mwanza',
    text: 'I was applying for a gig that needed verification with a proper CV. CV Chap Chap saved me - created a professional CV so fast!',
    avatar: 'LM',
  },
  {
    name: 'Jackson Lazaro',
    role: 'IT Support Technician',
    location: 'Arusha',
    text: 'Needed to update my CV quickly for a new opportunity. The AI suggestions made it look so professional in just 3 minutes!',
    avatar: 'JL',
  },
  {
    name: 'Mohammed Salim',
    role: 'Accountant',
    location: 'Dodoma',
    text: 'A recruiter asked for my CV on the spot. Used CV Chap Chap on my phone and had a beautiful CV ready before the call ended!',
    avatar: 'MS',
  },
  {
    name: 'Nassor Chongo',
    role: 'Operations Manager',
    location: 'Tanga',
    text: 'The speed is unbelievable! I was skeptical about 3 minutes but it actually works. Professional CV, ready to send instantly.',
    avatar: 'NC',
  },
  {
    name: 'Julius Msuya',
    role: 'Civil Engineer',
    location: 'Morogoro',
    text: 'Last minute job application and needed a better CV. CV Chap Chap delivered in under 3 minutes. Now I recommend it to everyone!',
    avatar: 'JM',
  },
];

const stats = [
  { value: '50,000+', label: 'CVs Created' },
  { value: '35', label: 'Templates' },
  { value: '3 min', label: 'Average Time' },
  { value: '4.9/5', label: 'User Rating' },
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
  { name: 'Airtel', logo: airtelLogo, size: 'lg' },
  { name: 'Azam Pesa', logo: azamPesaLogo, size: 'md' },
  { name: 'NMB Bank', logo: nmbLogo, size: 'md' },
  { name: 'SportPesa', logo: sportpesaLogo, size: 'md' },
  { name: 'Amsons Group', logo: amsonsLogo, size: 'xl' },
  { name: 'Tanzania Government', logo: tanzaniaGovtLogo, size: 'xl' },
  { name: 'MeTL Group', logo: metlLogo, size: 'lg' },
];

// Live Template Card component for homepage
function HomeTemplateCard({ template }: { template: typeof TEMPLATES[number] }) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const templateWidth = 794;
        const newScale = containerWidth / templateWidth;
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <Link href="/template" className="block">
      <div
        className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-white"
          style={{ paddingBottom: '130%' }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{
              transform: `scale(${scale})`,
              width: '794px',
              height: '1123px',
            }}
          >
            <TemplatePreview
              templateId={template.id}
              data={sampleCVData}
              scale={1}
              colorOverride={null}
            />
          </div>

          {/* Hover/Tap overlay with button */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end pb-6 transition-opacity z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'
          }`}>
            <span className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2">
              Use This Template
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Always visible button on mobile */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
            <span className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm w-full">
              Use This Template
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {template.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="w-3 h-3 rounded-full border border-gray-200"
              style={{ backgroundColor: template.primaryColor }}
            />
            <span className="text-xs text-gray-400 capitalize">{template.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

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
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-body overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-lg shadow-blue-900/5' : 'bg-white md:bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cv-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                CV <span className="text-cv-blue-600">Chap Chap</span>
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
              <Link href="/auth/login" className="px-4 py-2 text-gray-700 font-medium hover:text-cv-blue-600 transition-colors">
                Login
              </Link>
              <Link
                href="/template"
                className="px-6 py-2.5 bg-cv-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-cv-blue-700 transition-colors"
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
                  className="px-6 py-2.5 bg-cv-blue-600 text-white font-semibold rounded-lg text-center mt-2"
                >
                  Create CV Free
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">Made In Tanzania</span>
                <span className="text-xs">🇹🇿</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Create Your CV
                <span className="block text-cv-blue-600">
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
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cv-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-cv-blue-700 transition-colors text-lg"
                >
                  Create Your CV Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-colors text-lg"
                >
                  See How It Works
                </a>
              </div>

              {/* Success stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-sm font-semibold text-green-700">30% higher chance of getting a job*</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-sm font-semibold text-green-700">42% higher response rate from recruiters*</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Hero Image */}
                <Image
                  src="/images/cv-hero-image.png"
                  alt="Professional CV Example - Create your own CV"
                  width={550}
                  height={550}
                  className="w-full h-auto rounded-2xl"
                  priority
                />
                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                  ATS-Ready
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-cv-blue-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="font-display text-2xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-cv-blue-100 text-xs md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section - Auto-scrolling logos */}
      <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-8">
            Professionals from these companies have created CVs with us
          </p>
        </div>
        {/* Auto-scrolling marquee */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Double the logos for seamless loop */}
            {[...trustedCompanies, ...trustedCompanies, ...trustedCompanies].map((company, index) => (
              <div key={`${company.name}-${index}`} className="flex-shrink-0">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={company.size === 'xl' ? 140 : company.size === 'lg' ? 120 : 100}
                  height={company.size === 'xl' ? 56 : company.size === 'lg' ? 48 : 40}
                  className={`w-auto object-contain ${
                    company.size === 'xl' ? 'h-14' : company.size === 'lg' ? 'h-12' : 'h-10'
                  }`}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200" />
                )}

                <div className="relative bg-white rounded-xl p-6 border border-gray-200 text-center">
                  <div className="relative z-10 w-16 h-16 bg-cv-blue-50 text-cv-blue-600 rounded-xl flex items-center justify-center mx-auto mb-5">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center font-bold text-sm">
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-cv-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-cv-blue-700 transition-colors text-lg"
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
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="w-12 h-12 bg-cv-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-cv-blue-600" />
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
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                35+ Professional Templates
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose from our collection of recruiter-approved designs
              </p>
            </motion.div>
          </div>

          {/* Desktop: Grid of 6 with live previews */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <HomeTemplateCard template={template} />
              </motion.div>
            ))}
          </div>

          {/* Mobile: Vertical scroll - one card at a time */}
          <div className="md:hidden space-y-6">
            {homeTemplates.map((template) => (
              <HomeTemplateCard key={template.id} template={template} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/template"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cv-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-cv-blue-700 transition-colors"
            >
              Browse All 30+ Templates
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of professionals who landed their dream jobs
              </p>
            </motion.div>
          </div>

          {/* Desktop: 3 cards in a row */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Quote icon */}
                <div className="mb-4">
                  <svg className="w-8 h-8 text-cv-blue-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-cv-blue-500 to-cv-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: One card at a time with swipe */}
          <div className="md:hidden">
            <div className="relative">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                {/* Quote icon */}
                <div className="mb-4">
                  <svg className="w-8 h-8 text-cv-blue-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-cv-blue-500 to-cv-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonials[activeTestimonial].role} • {testimonials[activeTestimonial].location}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation arrows */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === activeTestimonial ? 'bg-cv-blue-600 w-6' : 'bg-gray-300 w-2'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Fair Pricing
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pay only when you download. No hidden fees, no subscriptions.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="bg-cv-blue-600 rounded-2xl p-8 text-white">
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
                className="block w-full py-4 bg-white text-cv-blue-600 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors"
              >
                Start Creating Your CV
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full bg-white rounded-xl p-6 text-left border border-gray-200"
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cv-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cv-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-lg"
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
                <div className="w-10 h-10 rounded-xl bg-cv-blue-600 flex items-center justify-center">
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
                <li><Link href="/affiliate" className="hover:text-white transition-colors">Become an Affiliate</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Dar es Salaam, Tanzania</li>
                <li><a href="mailto:info@cvchapchap.com" className="hover:text-white transition-colors">info@cvchapchap.com</a></li>
                <li><a href="tel:+255682152148" className="hover:text-white transition-colors">+255 682 152 148</a></li>
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
