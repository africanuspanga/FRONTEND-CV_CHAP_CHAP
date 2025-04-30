import React from 'react';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About CV Chap Chap - Empowering Tanzanians to Achieve Career Success</title>
        <meta 
          name="description" 
          content="Learn about CV Chap Chap, a platform dedicated to helping Tanzanian job seekers create professional CVs that stand out and help them achieve career success." 
        />
        <meta name="keywords" content="CV builder, CV Chap Chap, Tanzania, career success, professional resume, job application" />
      </Helmet>

      <div className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-6">
              About CV Chap Chap
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Empowering Tanzanians to Achieve Career Success
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
            <p className="text-lg text-gray-700 mb-6">
              At CV Chap Chap, our mission is to streamline the job application process for Tanzanians by providing a fast, user-friendly, and professional CV creation platform. We understand the challenges faced by job seekers in Tanzania, from recent graduates to seasoned professionals, and we're here to make the journey to employment smoother and more accessible.
            </p>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">Why Choose CV Chap Chap?</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-800">1. Professional CV Templates Tailored for the Tanzanian Job Market</h3>
                <p className="text-gray-700 mt-2">
                  Our platform offers a diverse range of professional CV templates designed to meet the expectations of employers in Tanzania. Whether you're applying for positions in Dar es Salaam, Arusha, or Mwanza, our templates are crafted to highlight your strengths and align with local hiring standards.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-800">2. Fast and Easy CV Creation</h3>
                <p className="text-gray-700 mt-2">
                  Time is of the essence when applying for jobs. With CV Chap Chap, you can create a professional CV online in just minutes. Our intuitive interface guides you through each step, ensuring that your CV is both comprehensive and compelling.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-800">3. Mobile-Friendly Platform</h3>
                <p className="text-gray-700 mt-2">
                  Recognizing that many of our users access the internet via mobile devices, CV Chap Chap is optimized for smartphones and tablets. This ensures that you can build and edit your CV anytime, anywhere—be it from your home in Dodoma or while commuting in Mbeya.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-800">4. Affordable and Accessible</h3>
                <p className="text-gray-700 mt-2">
                  We believe that everyone deserves the opportunity to present themselves professionally. That's why our services are priced affordably, making it easier for job seekers across Tanzania to access high-quality CV creation tools without financial strain.
                </p>
              </div>
            </div>
          </div>

          {/* Our Commitment Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">Our Commitment to Tanzanian Job Seekers</h2>
            <p className="text-lg text-gray-700 mb-6">
              We are dedicated to supporting the Ajira (employment) journey of every Tanzanian. By providing tools that simplify the CV creation process, we aim to increase your chances of landing your desired kazi (job). Our platform is continuously updated to reflect the evolving needs of the job market, ensuring that your CV remains relevant and impactful.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-indigo-800">Q: Can I customize my CV to suit different job applications?</h3>
                <p className="text-gray-700 mt-2">
                  A: Absolutely! Our platform allows you to edit and tailor your CV for various positions, ensuring that each application is targeted and effective.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-800">Q: Do you offer templates for specific industries?</h3>
                <p className="text-gray-700 mt-2">
                  A: Yes, we provide industry-specific templates catering to sectors such as healthcare, education, finance, and more, aligning with the diverse opportunities available in Tanzania.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-800">Q: Is my data secure on CV Chap Chap?</h3>
                <p className="text-gray-700 mt-2">
                  A: We prioritize your privacy and have implemented robust security measures to protect your personal information.
                </p>
              </div>
            </div>
          </div>

          {/* Join Community Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">Join the CV Chap Chap Community</h2>
            <p className="text-lg text-gray-700 mb-6">
              Thousands of Tanzanians have trusted CV Chap Chap to assist them in their job search. By choosing our platform, you're not only accessing top-notch CV creation tools but also joining a community committed to professional growth and success.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Start your journey to career success today with CV Chap Chap—where creating a standout CV is just a few clicks away.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => window.location.href = '/templates'}
                className="bg-indigo-900 hover:bg-indigo-800 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300"
              >
                CREATE NEW CV
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-indigo-900 text-white rounded-xl shadow-md p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
            <p className="text-center text-xl mb-8">
              We'd love to hear from you! Reach out to us with any questions or feedback.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p>contact@cvchapchap.co.tz</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p>+255 755 123 456</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Location</h3>
                <p>Mikocheni, Dar es Salaam, Tanzania</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;