"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-gray-500">
              Last updated: February 2026
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using CV Chap Chap's platform and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services. These terms apply to all visitors, users, and others who access or use our platform.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-600 leading-relaxed">
                CV Chap Chap provides an online platform for creating professional CVs and resumes. Our services include CV templates, AI-powered content suggestions, PDF generation, and related features. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                3. User Accounts
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use of your account</li>
                  <li>Ensuring your contact information is current and accurate</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                4. User Content and Conduct
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>You retain ownership of any content you create using our platform. By using our services, you agree not to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide false or misleading information in your CV</li>
                  <li>Use the service for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the platform's functionality</li>
                  <li>Copy, modify, or distribute our templates without permission</li>
                  <li>Use automated systems to access our services without authorization</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                5. Payment and Refunds
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p><strong className="text-gray-800">Pricing:</strong> CV downloads are charged at TZS 5,000 per download. Prices are subject to change with notice.</p>
                <p><strong className="text-gray-800">Payment Methods:</strong> We accept mobile money payments including M-Pesa, Tigo Pesa, Airtel Money, and other supported payment methods.</p>
                <p><strong className="text-gray-800">Refunds:</strong> Due to the digital nature of our product, refunds are generally not available once a PDF has been downloaded. If you experience technical issues preventing download, please contact our support team.</p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                6. Intellectual Property
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>The CV Chap Chap platform, including its design, templates, logos, and software, is owned by CV Chap Chap and protected by intellectual property laws.</p>
                <p>You are granted a limited, non-exclusive license to use our templates for creating personal CVs. You may not resell, redistribute, or use our templates for commercial template services.</p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                7. AI-Generated Content
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our platform uses artificial intelligence to provide content suggestions. While we strive for accuracy, AI-generated content is provided as suggestions only. You are responsible for reviewing and verifying all content in your CV before use. We do not guarantee the accuracy, completeness, or appropriateness of AI-generated suggestions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                8. Disclaimer of Warranties
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free. We do not guarantee that using our CVs will result in employment or specific outcomes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, CV Chap Chap shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                10. Indemnification
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to defend, indemnify, and hold harmless CV Chap Chap and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services, your violation of these terms, or your violation of any rights of another.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                11. Termination
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use our services will cease immediately. You may delete your account at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                12. Governing Law
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United Republic of Tanzania, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Tanzania.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                13. Changes to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new terms on our platform and updating the "Last updated" date. Your continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                14. Severability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                15. Contact Information
              </h2>
              <p className="text-gray-600 leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700 font-medium">CV Chap Chap</p>
                <p className="text-gray-600">Email: legal@cvchapchap.com</p>
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
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-white">Terms of Service</Link>
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
