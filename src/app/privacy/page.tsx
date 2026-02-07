"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cv-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cv-blue-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                CV <span className="bg-gradient-to-r from-cv-blue-700 via-cv-blue-500 to-cv-blue-400 bg-clip-text text-transparent">Chap Chap</span>
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500">
              Last updated: February 2026
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                CV Chap Chap ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our CV creation platform and related services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p><strong className="text-gray-800">Personal Information:</strong> When you create a CV, we collect information you provide such as your name, email address, phone number, work history, education, and other details you choose to include in your resume.</p>
                <p><strong className="text-gray-800">Account Information:</strong> If you create an account, we collect your email address and authentication credentials.</p>
                <p><strong className="text-gray-800">Payment Information:</strong> When you make a purchase, payment processing is handled by secure third-party payment providers. We do not store complete payment card details.</p>
                <p><strong className="text-gray-800">Usage Data:</strong> We automatically collect information about how you interact with our platform, including pages visited, features used, and time spent on the service.</p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
                <li>To provide and maintain our CV creation services</li>
                <li>To process transactions and send related information</li>
                <li>To generate AI-powered content suggestions for your CV</li>
                <li>To send you service updates and promotional communications (with your consent)</li>
                <li>To improve and optimize our platform and user experience</li>
                <li>To detect, prevent, and address technical issues or security threats</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                4. Data Storage and Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your data is stored securely using industry-standard encryption and security measures. CV data is stored locally on your device and in our secure cloud infrastructure. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                5. Data Sharing
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We do not sell your personal information. We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-gray-800">Service Providers:</strong> Third-party vendors who assist in operating our platform (hosting, payment processing, AI services)</li>
                  <li><strong className="text-gray-800">Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong className="text-gray-800">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for data processing</li>
                <li>Export your CV data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                10. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700 font-medium">CV Chap Chap</p>
                <p className="text-gray-600">Email: privacy@cvchapchap.com</p>
                <p className="text-gray-600">Location: Dar es Salaam, Tanzania</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-cv-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cv-blue-500 to-cyan-400 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">CV Chap Chap</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link href="/privacy" className="text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CV Chap Chap. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
