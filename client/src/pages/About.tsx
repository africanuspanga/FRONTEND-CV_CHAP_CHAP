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
            <h2 className="text-3xl font-bold text-indigo-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              At CV Chap Chap, our mission is to bridge the gap between talented Tanzanian professionals and meaningful career opportunities. We believe that everyone deserves access to tools that can help them showcase their qualifications effectively.
            </p>
            <p className="text-lg text-gray-700">
              Our platform is designed to make the CV creation process simple, accessible, and empowering, allowing job seekers to present themselves professionally and confidently to potential employers.
            </p>
          </div>

          {/* Why Choose Us Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">Why Choose CV Chap Chap?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-indigo-800">Tanzanian-focused templates:</strong> Our CV templates are specifically designed for the Tanzanian job market.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-indigo-800">AI-powered assistance:</strong> Get smart recommendations for skills and job descriptions based on your industry.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-indigo-800">Real-time preview:</strong> See changes to your CV instantly as you create it.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-indigo-800">User-friendly interface:</strong> Our step-by-step process makes CV creation simple and stress-free.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">Our Values</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-indigo-800">Accessibility:</strong> Making professional CV tools available to all Tanzanians regardless of technical expertise.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-indigo-800">Quality:</strong> Helping job seekers create CVs that meet international standards while addressing local requirements.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-indigo-800">Empowerment:</strong> Providing resources that help individuals take control of their career journey.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong className="text-indigo-800">Innovation:</strong> Continuously improving our platform with cutting-edge technology to better serve our users.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Our Team Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-indigo-900 mb-10 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">JP</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-900">John Paul</h3>
                <p className="text-gray-600">Founder & CEO</p>
                <p className="mt-2 text-gray-700">
                  HR professional with over 10 years of experience in Tanzania's job market.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">MM</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-900">Mary Msoka</h3>
                <p className="text-gray-600">Senior CV Specialist</p>
                <p className="mt-2 text-gray-700">
                  Career coach with expertise in helping professionals in various industries.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">EK</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-900">Emmanuel Kimaro</h3>
                <p className="text-gray-600">Technical Lead</p>
                <p className="mt-2 text-gray-700">
                  Software engineer passionate about creating tools that solve local challenges.
                </p>
              </div>
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