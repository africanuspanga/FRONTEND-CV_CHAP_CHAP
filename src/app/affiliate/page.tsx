'use client';

import Link from 'next/link';
import { FileText, DollarSign, Users, TrendingUp, Share2, Smartphone, ArrowRight, CheckCircle, BarChart3, Headphones, Clock } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Earn TZS 1,000 Per Sale',
    description: 'Get 20% commission on every CV purchase (TZS 5,000) made through your referral link.',
  },
  {
    icon: Share2,
    title: 'Easy to Share',
    description: 'Get a unique referral link you can share on WhatsApp, social media, or anywhere.',
  },
  {
    icon: Smartphone,
    title: 'M-Pesa Withdrawals',
    description: 'Withdraw your earnings directly to your M-Pesa account. Minimum TZS 5,000.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Dashboard',
    description: 'Track your clicks, conversions, and earnings in real-time from your dashboard.',
  },
  {
    icon: Users,
    title: 'Help Job Seekers',
    description: 'Help people in Tanzania create professional CVs while earning money.',
  },
  {
    icon: CheckCircle,
    title: 'No Cost to Join',
    description: 'Becoming an affiliate is completely free. Just sign up and start sharing.',
  },
];

const steps = [
  { number: '1', title: 'Apply Online', description: 'Submit your application through our affiliate program. It takes less than 2 minutes.' },
  { number: '2', title: 'Get Approved', description: 'Our team reviews your application and approves you within 24 hours.' },
  { number: '3', title: 'Set Up Your Links', description: 'Use your affiliate links to promote CV Chap Chap via WhatsApp, blogs, social media, and more.' },
  { number: '4', title: 'Start Earning', description: 'We credit TZS 1,000 for every person who purchases a CV through your link.' },
];

const programIncludes = [
  {
    icon: TrendingUp,
    title: 'Unlimited Earning Potential',
    description: 'Build as much revenue as you can. There is no cap on your commissions.',
  },
  {
    icon: DollarSign,
    title: 'Commission Rate: TZS 1,000 per sale',
    description: 'Earn 20% on every TZS 5,000 CV purchase made through your referral link.',
  },
  {
    icon: BarChart3,
    title: 'Revenue Statistics',
    description: 'You get access to all your referral stats, so you are up to date with how much you earn.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Affiliate Support',
    description: 'We have a dedicated team that manages our partner program and helps you succeed.',
  },
  {
    icon: Clock,
    title: 'Referral Window: 30 Days',
    description: 'Our cookie stays fresh for 30 days \u2013 so you get paid if your referrals buy within this time.',
  },
];

const faqs = [
  {
    q: 'How much can I earn?',
    a: 'You earn TZS 1,000 (20%) for every CV purchased through your referral link. There is no cap on earnings.',
  },
  {
    q: 'How do I get paid?',
    a: 'You can withdraw your earnings to M-Pesa once you reach TZS 5,000. Payouts are processed after admin approval.',
  },
  {
    q: 'How long does the referral cookie last?',
    a: 'When someone clicks your link, they are tracked for 30 days. If they purchase a CV within that time, you get the commission.',
  },
  {
    q: 'Do I need to be a CV Chap Chap user?',
    a: 'Yes, you need a CV Chap Chap account to sign up as an affiliate. You can create one for free.',
  },
  {
    q: 'Where can I promote my link?',
    a: 'Share on WhatsApp, Instagram, Twitter/X, TikTok, Facebook, blogs, email newsletters, or any platform where people look for jobs.',
  },
];

export default function AffiliateLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cv-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl text-gray-900">
              CV <span className="text-cv-blue-600">Chap Chap</span>
            </span>
          </Link>
          <Link
            href="/affiliate/register"
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-cv-blue-600 text-white font-semibold rounded-lg hover:bg-cv-blue-700 transition-colors text-xs sm:text-sm"
          >
            Become an Affiliate
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-cv-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg mb-6">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Earn TZS 1,000 per sale</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Earn Money with the CV Chap Chap
            <span className="block text-cv-blue-600">Affiliate Program</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Refer visitors to CV Chap Chap and earn TZS 1,000 commission for every new purchase.
            Join today to turn your trusted recommendations into income and grow your revenue.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/affiliate/register"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-cv-blue-600 text-white font-semibold rounded-lg hover:bg-cv-blue-700 transition-colors text-base sm:text-lg"
            >
              Sign Up for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-base sm:text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-12 bg-cv-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: '20%', label: 'Commission Rate' },
              { value: 'TZS 1,000', label: 'Per Sale' },
              { value: '30 Days', label: 'Cookie Duration' },
              { value: 'M-Pesa', label: 'Instant Payout' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-cv-blue-100 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              You get paid by advertising our brand to your audience on your social media,
              blog, website, newsletter, or WhatsApp groups.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                  {step.number}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Program Includes */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-cv-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Our Program Includes
            </h2>

            <div className="space-y-5 sm:space-y-6">
              {programIncludes.map((item) => (
                <div key={item.title} className="flex gap-3 sm:gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <item.icon className="w-5 h-5 text-cv-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join Our Affiliate Program?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-cv-blue-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cv-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{benefit.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Earning Potential
            </h2>
            <p className="text-gray-600">See how much you could earn</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-8 border border-gray-200">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
              {[
                { sales: 10, earnings: '10,000' },
                { sales: 50, earnings: '50,000' },
                { sales: 100, earnings: '100,000' },
              ].map((tier) => (
                <div key={tier.sales} className="bg-gray-50 rounded-xl p-3 sm:p-6 border border-gray-100">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{tier.sales}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">sales/month</div>
                  <div className="text-base sm:text-xl font-bold text-green-600">TZS {tier.earnings}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400">per month</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{faq.q}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-6 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 px-6 sm:px-12 py-8 sm:py-12">
            {/* Decorative blurs */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center sm:text-left">
                Become an affiliate<br className="hidden sm:block" /> today!
              </h2>
              <Link
                href="/affiliate/register"
                className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-3.5 bg-amber-100 text-gray-900 font-semibold rounded-full hover:bg-amber-200 transition-colors text-base sm:text-lg shadow-lg"
              >
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CV Chap Chap. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
