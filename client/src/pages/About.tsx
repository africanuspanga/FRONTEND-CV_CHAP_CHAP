import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const About = () => {
  const [, navigate] = useLocation();

  return (
    <>
      <Helmet>
        <title>About CV Chap Chap - Empowering Tanzanian Job Seekers</title>
        <meta 
          name="description" 
          content="CV Chap Chap provides fast, easy, and professional CV creation for Tanzanians. Learn about our mission to empower job seekers across Tanzania with affordable CV tools." 
        />
        <meta name="keywords" content="CV creator Tanzania, Tanzanian resume builder, job application Tanzania, professional CV templates, affordable CV service" />
        <link rel="canonical" href="/about" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-12 text-center">
            <h1 className="text-4xl font-bold mb-2">About CV Chap Chap</h1>
            <p className="text-xl font-medium">Empowering Tanzanians to Achieve Career Success</p>
          </div>

          {/* Main Content */}
          <div className="px-8 py-10">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                At CV Chap Chap, our mission is to streamline the job application process for Tanzanians by providing a fast, user-friendly, and professional CV creation platform. We understand the challenges faced by job seekers in Tanzania, from recent graduates to seasoned professionals, and we're here to make the journey to employment smoother and more accessible.
              </p>

              <h2 className="text-2xl font-bold text-indigo-900 mt-10 mb-6">Why Choose CV Chap Chap?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">Professional CV Templates Tailored for the Tanzanian Job Market</h3>
                  <p className="text-gray-700">
                    Our platform offers a diverse range of professional CV templates designed to meet the expectations of employers in Tanzania. Whether you're applying for positions in Dar es Salaam, Arusha, or Mwanza, our templates are crafted to highlight your strengths and align with local hiring standards.
                  </p>
                </div>

                <div className="bg-teal-50 p-6 rounded-lg border border-teal-100">
                  <h3 className="text-xl font-semibold text-teal-700 mb-3">Fast and Easy CV Creation</h3>
                  <p className="text-gray-700">
                    Time is of the essence when applying for jobs. With CV Chap Chap, you can create a professional CV online in just minutes. Our intuitive interface guides you through each step, ensuring that your CV is both comprehensive and compelling.
                  </p>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">Mobile-Friendly Platform</h3>
                  <p className="text-gray-700">
                    Recognizing that many of our users access the internet via mobile devices, CV Chap Chap is optimized for smartphones and tablets. This ensures that you can build and edit your CV anytime, anywhere—be it from your home in Dodoma or while commuting in Mbeya.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                  <h3 className="text-xl font-semibold text-purple-700 mb-3">Affordable and Accessible</h3>
                  <p className="text-gray-700">
                    We believe that everyone deserves the opportunity to present themselves professionally. That's why our services are priced affordably, making it easier for job seekers across Tanzania to access high-quality CV creation tools without financial strain.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-indigo-900 mt-10 mb-6">Our Commitment to Tanzanian Job Seekers</h2>
              <p className="text-gray-700 leading-relaxed mb-10">
                We are dedicated to supporting the Ajira (employment) journey of every Tanzanian. By providing tools that simplify the CV creation process, we aim to increase your chances of landing your desired kazi (job). Our platform is continuously updated to reflect the evolving needs of the job market, ensuring that your CV remains relevant and impactful.
              </p>

              <h2 className="text-2xl font-bold text-indigo-900 mt-10 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I customize my CV to suit different job applications?</h3>
                  <p className="text-gray-700">
                    Absolutely! Our platform allows you to edit and tailor your CV for various positions, ensuring that each application is targeted and effective.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer templates for specific industries?</h3>
                  <p className="text-gray-700">
                    Yes, we provide industry-specific templates catering to sectors such as healthcare, education, finance, and more, aligning with the diverse opportunities available in Tanzania.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure on CV Chap Chap?</h3>
                  <p className="text-gray-700">
                    We prioritize your privacy and have implemented robust security measures to protect your personal information.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-indigo-900 mt-10 mb-6">Join the CV Chap Chap Community</h2>
              <p className="text-gray-700 leading-relaxed mb-10">
                Thousands of Tanzanians have trusted CV Chap Chap to assist them in their job search. By choosing our platform, you're not only accessing top-notch CV creation tools but also joining a community committed to professional growth and success.
              </p>
              <p className="text-gray-700 leading-relaxed mb-10">
                Start your journey to career success today with CV Chap Chap—where creating a standout CV is just a few clicks away.
              </p>
            </div>

            <div className="text-center mt-12">
              <Button 
                onClick={() => navigate('/create/method')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg font-medium rounded-lg transform transition hover:scale-105"
              >
                CREATE NEW CV
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;