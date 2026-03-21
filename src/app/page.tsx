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
  Download,
  Sparkles,
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

const homeTemplateIds = ['charles', 'kathleen', 'grace-mint', 'classic-elegant', 'hexagon-blue', 'creative-yellow'];
const homeTemplates = TEMPLATES.filter(t => homeTemplateIds.includes(t.id));

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create a professional CV in under 5 minutes. Simple steps, zero confusion.',
  },
  {
    icon: FileText,
    title: '35+ Templates',
    description: 'Recruiter-approved designs built for the East African job market.',
  },
  {
    icon: Bot,
    title: 'AI-Powered',
    description: 'Smart content suggestions tailored to your industry and role.',
  },
  {
    icon: CheckCircle,
    title: 'ATS-Friendly',
    description: 'Our CVs pass Applicant Tracking Systems used by top employers.',
  },
  {
    icon: Download,
    title: 'Instant PDF',
    description: 'Download a high-quality PDF ready to send to any employer immediately.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Built for your phone. Create your CV from anywhere, anytime.',
  },
];

const steps = [
  { number: '01', title: 'Pick a Template', description: 'Choose from 35+ professional designs', icon: FileText },
  { number: '02', title: 'Add Your Details', description: 'AI helps you write compelling content', icon: Bot },
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
    text: 'I was applying for a gig that needed verification with a proper CV. CV Chap Chap saved me — created a professional CV so fast!',
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
  { value: '35+', label: 'Templates' },
  { value: '3 min', label: 'Average Time' },
  { value: '4.9★', label: 'User Rating' },
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

const latestBlogPosts = [
  {
    slug: 'how-to-write-cv-tanzania-2026',
    title: 'How to Write a CV That Gets Interviews in Tanzania (2026 Guide)',
    excerpt: 'A complete, step-by-step guide to writing a professional CV that actually gets you called for interviews in the Tanzanian and East African job market.',
    category: 'CV Writing',
    readTime: 12,
    publishDate: '2026-02-20',
    featuredImage: '/Blog-Images/istockphoto-647967692-612x612.jpg',
  },
  {
    slug: 'common-cv-mistakes-costing-you-jobs',
    title: '5 Common CV Mistakes That Are Costing You Jobs — And How to Fix Them',
    excerpt: 'Are you sending out CVs but never hearing back? These 5 common mistakes might be the reason your CV keeps getting rejected.',
    category: 'CV Tips',
    readTime: 8,
    publishDate: '2026-02-18',
    featuredImage: '/Blog-Images/istockphoto-172746835-612x612.jpg',
  },
  {
    slug: 'fresh-graduate-cv-no-experience',
    title: "Fresh Graduate? Here's How to Create a Powerful CV With No Experience",
    excerpt: 'You just graduated and have zero work experience. Does that mean you cannot have a strong CV? Absolutely not. Here is how to build a CV that gets you hired.',
    category: 'CV Writing',
    readTime: 10,
    publishDate: '2026-02-15',
    featuredImage: '/Blog-Images/istockphoto-2187092663-612x612.jpg',
  },
];

function BlogPreviewSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-cv-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">From the Blog</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              CV Tips & Career Advice
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-cv-blue-600 font-semibold text-sm hover:gap-2.5 transition-all"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestBlogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-cv-blue-200 hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-0.5 bg-cv-blue-50 text-cv-blue-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-xs">{post.readTime} min read</span>
                    </div>
                    <h3 className="font-display font-bold text-gray-900 mb-2 group-hover:text-cv-blue-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-gray-400 text-xs">
                        {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-cv-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-cv-blue-600 text-cv-blue-600 font-semibold rounded-xl hover:bg-cv-blue-50 transition-colors text-sm"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomeTemplateCard({ template }: { template: typeof TEMPLATES[number] }) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / 794);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <Link href="/template" className="block group">
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div ref={containerRef} className="relative overflow-hidden bg-white" style={{ paddingBottom: '130%' }}>
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{ transform: `scale(${scale})`, width: '794px', height: '1123px' }}
          >
            <TemplatePreview templateId={template.id} data={sampleCVData} scale={1} colorOverride={null} />
          </div>

          <div className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col items-center justify-end pb-5 transition-opacity z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="px-5 py-2.5 bg-white text-gray-900 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2">
              Use This Template <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
            <span className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm w-full">
              Use Template <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-gray-50">
          <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: template.primaryColor }} />
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-body overflow-x-hidden">

      {/* ─── Navigation ─────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 40 ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cv-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className={`font-display font-bold text-lg transition-colors ${scrollY > 40 ? 'text-gray-900' : 'text-white'}`}>
                CV <span className={scrollY > 40 ? 'text-cv-blue-600' : 'text-blue-200'}>Chap Chap</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {[
                { href: '/template', label: 'Templates' },
                { href: '/letter', label: 'Cover Letters' },
                { href: '/blog', label: 'Blog' },
                { href: '#contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <Link key={label} href={href} className={`font-medium text-sm transition-colors hover:text-cv-blue-400 ${scrollY > 40 ? 'text-gray-600' : 'text-white/80'}`}>
                  {label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className={`text-sm font-medium transition-colors ${scrollY > 40 ? 'text-gray-600 hover:text-cv-blue-600' : 'text-white/80 hover:text-white'}`}>
                Login
              </Link>
              <Link href="/template" className="px-5 py-2 bg-cv-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-cv-blue-700 transition-colors shadow-sm">
                Create CV Free
              </Link>
            </div>

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen
                ? <X className={`w-6 h-6 ${scrollY > 40 ? 'text-gray-900' : 'text-white'}`} />
                : <Menu className={`w-6 h-6 ${scrollY > 40 ? 'text-gray-900' : 'text-white'}`} />
              }
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-3 pb-4 border-t border-white/10">
              <div className="flex flex-col gap-4 pt-4">
                {[
                  { href: '/template', label: 'Templates' },
                  { href: '/letter', label: 'Cover Letters' },
                  { href: '/blog', label: 'Blog' },
                  { href: '#contact', label: 'Contact' },
                ].map(({ href, label }) => (
                  <Link key={label} href={href} onClick={() => setIsMenuOpen(false)} className="text-white/90 font-medium">
                    {label}
                  </Link>
                ))}
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="text-white/70">Login</Link>
                <Link href="/template" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 bg-white text-cv-blue-700 font-bold rounded-xl text-center mt-1">
                  Create CV Free
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gray-900 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-cv-blue-950/80 to-gray-900" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cv-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cv-blue-800/10 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full mb-7 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">Made in Tanzania 🇹🇿</span>
                </div>

                <h1 className="font-display font-bold text-white leading-[1.1] mb-6">
                  <span className="text-4xl sm:text-5xl lg:text-6xl block">Create Your CV</span>
                  <span className="text-4xl sm:text-5xl lg:text-6xl block mt-1">
                    in{' '}
                    <span className="relative inline-block">
                      <span className="text-cv-blue-400">3 Minutes</span>
                      <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5.5C40 2 80 1 100 1.5C120 2 160 3.5 199 6" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </span>
                </h1>

                <p className="text-lg text-white/70 mb-8 max-w-md leading-relaxed">
                  AI-powered CV builder with 35+ professional templates — designed for East African job seekers. Free to create, instant to download.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link
                    href="/template"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-cv-blue-600 text-white font-bold rounded-xl hover:bg-cv-blue-500 transition-colors text-base shadow-lg shadow-cv-blue-900/40"
                  >
                    <Sparkles className="w-4 h-4" />
                    Create Your CV Free
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-base backdrop-blur-sm"
                  >
                    See How It Works
                    <ChevronDown className="w-4 h-4" />
                  </a>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                    </div>
                    <span className="text-sm text-white/70 font-medium">4.9/5 from 1,000+ users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/70 font-medium">50,000+ CVs created</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — Hero Image (desktop only) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-cv-blue-600/20 rounded-3xl blur-2xl" />
                <Image
                  src="/images/cv-hero-image.png"
                  alt="Professional CV Example"
                  width={560}
                  height={560}
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                  priority
                />
                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  ATS-Ready ✓
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-cv-blue-50 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cv-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Average time</p>
                    <p className="font-bold text-gray-900">3 minutes</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── Stats Bar ──────────────────────────────────────── */}
      <section className="py-10 bg-cv-blue-600">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-blue-100 text-xs sm:text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trusted By ─────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <p className="text-center text-gray-400 text-sm font-medium tracking-wide uppercase">
            Professionals from these companies have created CVs with us
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...trustedCompanies, ...trustedCompanies, ...trustedCompanies].map((company, index) => (
              <div key={`${company.name}-${index}`} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={company.size === 'xl' ? 140 : company.size === 'lg' ? 120 : 100}
                  height={company.size === 'xl' ? 56 : company.size === 'lg' ? 48 : 40}
                  className={`w-auto object-contain ${company.size === 'xl' ? 'h-12' : company.size === 'lg' ? 'h-10' : 'h-8'}`}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-cv-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              From Zero to Professional CV<br className="hidden sm:block" /> in 3 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-gray-50 rounded-2xl p-7 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 bg-cv-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="font-display font-bold text-4xl text-gray-100 select-none">{step.number}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/template"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-cv-blue-600 text-white font-semibold rounded-xl hover:bg-cv-blue-700 transition-colors shadow-sm"
            >
              Start Creating Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────── */}
      <section id="features" className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-cv-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">Why CV Chap Chap</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Everything You Need to Stand Out
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Built specifically for job seekers across East Africa
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-cv-blue-500/30 transition-all group"
              >
                <div className="w-11 h-11 bg-cv-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cv-blue-600/30 transition-colors">
                  <feature.icon className="w-5 h-5 text-cv-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Templates ──────────────────────────────────────── */}
      <section id="templates" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-cv-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Templates</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              35+ Professional Designs
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Recruiter-approved templates, ready to fill in and download
            </p>
          </div>

          {/* Desktop: 6 templates */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {homeTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <HomeTemplateCard template={template} />
              </motion.div>
            ))}
          </div>

          {/* Mobile: Only 3 templates for performance */}
          <div className="md:hidden grid grid-cols-1 gap-5">
            {homeTemplates.slice(0, 3).map((template) => (
              <HomeTemplateCard key={template.id} template={template} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/template"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-cv-blue-600 text-cv-blue-600 font-semibold rounded-xl hover:bg-cv-blue-600 hover:text-white transition-all"
            >
              Browse All 35+ Templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-cv-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Success Stories</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              People Are Getting Jobs
            </h2>
          </div>

          {/* Desktop: 3 columns */}
          <div className="hidden md:grid md:grid-cols-3 gap-5">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 bg-gradient-to-br from-cv-blue-500 to-cv-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.role} · {testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Carousel */}
          <div className="md:hidden">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;{testimonials[activeTestimonial].text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="w-11 h-11 bg-gradient-to-br from-cv-blue-500 to-cv-blue-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</p>
                  <p className="text-sm text-gray-400">{testimonials[activeTestimonial].role} · {testimonials[activeTestimonial].location}</p>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center gap-2 mt-5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${index === activeTestimonial ? 'bg-cv-blue-600 w-6' : 'bg-gray-200 w-2'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              Common Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────── */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cv-blue-600/20 border border-cv-blue-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-cv-blue-400" />
              <span className="text-cv-blue-300 text-sm font-semibold">Free to Create</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
              Your Dream Job<br />Starts with a Great CV
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ East Africans who have already built their professional CVs with CV Chap Chap.
            </p>
            <Link
              href="/template"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cv-blue-600 text-white font-bold rounded-xl hover:bg-cv-blue-500 transition-colors text-lg shadow-lg shadow-cv-blue-900/50"
            >
              <Sparkles className="w-5 h-5" />
              Create Your CV Now — Free
            </Link>
            <p className="text-gray-500 text-sm mt-4">Only TZS 5,000 to download. No subscription.</p>
          </motion.div>
        </div>
      </section>

      {/* ─── Blog Preview ───────────────────────────────────── */}
      <BlogPreviewSection />

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-white py-14" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-cv-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-lg">CV Chap Chap</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm mb-5 leading-relaxed">
                Tanzanian company revolutionizing job applications with AI-powered CV creation. Fast, affordable, and built for East Africa.
              </p>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>🇹🇿</span>
                <span>Made with pride in Tanzania</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><Link href="/template" className="hover:text-white transition-colors">Create CV</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/affiliate" className="hover:text-white transition-colors">Become an Affiliate</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact</h4>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li>Dar es Salaam, Tanzania</li>
                <li>
                  <a href="mailto:info@cvchapchap.com" className="hover:text-white transition-colors">
                    info@cvchapchap.com
                  </a>
                </li>
                <li>
                  <a href="tel:+255682152148" className="hover:text-white transition-colors">
                    +255 682 152 148
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} CV Chap Chap. All rights reserved.</p>
            <div className="flex gap-5 text-gray-500 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
