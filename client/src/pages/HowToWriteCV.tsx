import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Edit, CheckCircle, Users, BookOpen } from "lucide-react";

const HowToWriteCV: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightBg">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How to Write a CV
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Complete guide with examples, samples & free templates for Tanzania, Kenya, and Uganda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cv-steps">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 px-8 py-3">
                <FileText className="mr-2 h-5 w-5" />
                Start Building Your CV
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                <Download className="mr-2 h-5 w-5" />
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            If you're searching for how to write a CV, fill out a CV form, or find good CV examples for your first job, this guide is for you. Whether you're in Tanzania, Kenya, Uganda, or anywhere else, we'll walk you through step-by-step — from creating a simple CV to writing a barua ya maombi ya kazi (job application letter).
          </p>
          <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
            <p className="text-primary font-medium">
              <strong>Want to skip the hard part?</strong> Use our free CV builder and create a professional CV in under 3 minutes.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-darkText mb-8 text-center">Frequently Asked Questions</h2>
          
          {/* FAQ Items */}
          <div className="space-y-8">
            {/* FAQ 1 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-darkText mb-4 flex items-center">
                  <Edit className="mr-3 h-5 w-5 text-primary" />
                  1. How to write a CV in English?
                </h3>
                <p className="text-gray-700 mb-4">
                  To write a CV in English, follow this simple structure:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <strong>Full Name</strong>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <strong>Contact Information</strong> (phone, email, city)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <strong>Professional Summary</strong> – a short paragraph about you
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <strong>Education</strong> – schools, degrees, and graduation years
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <strong>Work Experience</strong> – positions held, companies, and dates
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <strong>Skills</strong> – what you're good at (e.g., Microsoft Word, customer service)
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  You can also check out a mfano wa CV (CV example) or download a cv template for free from CV Chap Chap.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 2 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-darkText mb-4 flex items-center">
                  <Users className="mr-3 h-5 w-5 text-primary" />
                  2. What is CV used for?
                </h3>
                <p className="text-gray-700 mb-4">
                  A CV (Curriculum Vitae) is used to apply for jobs, internships, training programs, and scholarships. It shows employers:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Your background
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Your experience
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Your qualifications
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  You also need a CV for things like visa applications and professional registration. If you're writing your first CV, it's best to start with a simple format or use CV samples to guide you.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 3 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-darkText mb-4 flex items-center">
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  3. How can I fill out my CV form?
                </h3>
                <p className="text-gray-700 mb-4">To fill out a CV form:</p>
                <ol className="space-y-2 text-gray-700 ml-6 list-decimal">
                  <li>Enter your personal details (name, phone, email)</li>
                  <li>Add your education history (school, course, year)</li>
                  <li>Include any work experience (role, company, dates)</li>
                  <li>List your skills (languages, computer, soft skills)</li>
                  <li>Save and export it as a PDF</li>
                </ol>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mt-4">
                  <p className="text-green-700">
                    <strong>Need help?</strong> Use our online CV builder — just answer a few questions and your CV is ready instantly.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ 4 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-darkText mb-4 flex items-center">
                  <Download className="mr-3 h-5 w-5 text-primary" />
                  4. How to write a CV PDF in English?
                </h3>
                <p className="text-gray-700 mb-4">To write a CV PDF:</p>
                <ol className="space-y-2 text-gray-700 ml-6 list-decimal">
                  <li>Open Microsoft Word, Google Docs, or CV Chap Chap.</li>
                  <li>Use a clean, professional CV format with headings.</li>
                  <li>Include all your relevant experience.</li>
                  <li>Export or download it as a PDF.</li>
                </ol>
                <p className="text-gray-700 mt-4">
                  For the best results, always keep your CV updated and free from typos. If you don't have a computer, CV Chap Chap works from your phone too.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 5 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-darkText mb-4 flex items-center">
                  <Edit className="mr-3 h-5 w-5 text-primary" />
                  5. How do I write my simple CV?
                </h3>
                <p className="text-gray-700 mb-4">A simple CV includes just the basics:</p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Name and contact info
                  </li>  
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Short bio or summary
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Your education
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Any experience or internships
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Skills
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  This is perfect for students, fresh graduates, and those making their first job application.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-4">
                  <p className="text-blue-700">
                    <strong>💡 Tip:</strong> If you're not sure where to start, use good CV examples for a first job from our sample gallery.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ 6 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-darkText mb-4 flex items-center">
                  <BookOpen className="mr-3 h-5 w-5 text-primary" />
                  6. How to write CV letter examples?
                </h3>
                <p className="text-gray-700 mb-4">
                  A CV letter is also known as a cover letter or in Swahili, barua ya maombi ya kazi.
                </p>
                <p className="text-gray-700 mb-4">Here's how to write one:</p>
                <ol className="space-y-2 text-gray-700 ml-6 list-decimal">
                  <li><strong>Greeting</strong> (e.g., Dear Hiring Manager)</li>
                  <li><strong>Introduction</strong> – who you are and the job you're applying for</li>
                  <li><strong>Body</strong> – explain your qualifications and why you're a good fit</li>
                  <li><strong>Closing</strong> – thank them and include your contact info</li>
                </ol>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
                  <p className="text-yellow-700">
                    <strong>👉 Want a done-for-you option?</strong> CV Chap Chap will soon auto-generate barua ya maombi ya kazi based on your CV content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Free Templates Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-darkText mb-6 text-center">
            📁 Free CV Templates & Examples
          </h2>
          <p className="text-lg text-gray-700 mb-6 text-center">
            We provide real, editable examples and templates for different use cases:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">CV samples for experienced professionals</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Example of a CV for students</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">CV template for internship applications</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Swahili-style layouts that work well locally</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-700 text-center mb-6">
            All templates are mobile-friendly, ATS-compatible, and downloadable as PDFs.
          </p>
          <div className="text-center">
            <Link href="/templates">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Download className="mr-2 h-4 w-4" />
                View All Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Final Word */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-darkText mb-4">✅ Final Word</h2>
          <p className="text-lg text-gray-700 mb-6">
            Writing a great CV doesn't have to be complicated. With the right format, a few simple edits, and professional design, your CV can stand out. Use CV Chap Chap to build a polished CV fast, whether you're writing your first CV or updating an old one.
          </p>
          <Link href="/cv-steps">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3">
              <FileText className="mr-2 h-5 w-5" />
              👉 Start Building Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowToWriteCV;