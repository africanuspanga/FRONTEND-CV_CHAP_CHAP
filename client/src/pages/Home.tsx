import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { templateImages } from '@/lib/template-images';
import { homePageFeaturedTemplates } from '@/lib/template-priority';
// Import the hero image
import heroWomanImage from '@/assets/professional-woman-high-quality.png';
// Import company logos
import vodacomLogo from '../assets/company-logos/vodacom.png';
import tccLogo from '../assets/company-logos/tcc.webp';
import nmbLogo from '../assets/company-logos/nmb.png';
import jubileeLogo from '../assets/company-logos/jubilee.png';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-primary">Enjoy Less</span> <span className="text-darkText">Hustle,</span> <span className="text-primary">More</span> <span className="text-darkText">Job Offers Fast</span>
            </h1>
            <p className="text-lg text-lightText mb-8">
              Build your CV in minutes and land interviews faster. CV Chap Chap makes it easy for Job seekers to create job-ready CVs with zero stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="px-8">
                <Link href="/cv-steps">Build New CV</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/templates">Browse Templates</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-primary rounded-lg opacity-10 transform rotate-3"></div>
              <div className="absolute inset-0 bg-primary rounded-lg opacity-10 transform -rotate-3"></div>
              <img
                src={heroWomanImage}
                alt="Professional woman in business attire"
                className="relative z-10 w-full h-auto rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-neutral rounded-xl my-16 shadow-md">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Create your professional CV in three simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl border border-blue-100">
            <div className="p-6">
              <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto shadow-md">1</div>
              <h3 className="text-xl font-semibold text-center mb-3 text-blue-800">Select Template</h3>
              <p className="text-center text-gray-600">Choose from our professional CV templates designed to impress employers.</p>
            </div>
            <div className="bg-blue-50 h-2"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl border border-blue-100">
            <div className="p-6">
              <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto shadow-md">2</div>
              <h3 className="text-xl font-semibold text-center mb-3 text-blue-800">Fill Details</h3>
              <p className="text-center text-gray-600">Enter your information using our guided step-by-step form process.</p>
            </div>
            <div className="bg-blue-50 h-2"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl border border-blue-100">
            <div className="p-6">
              <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto shadow-md">3</div>
              <h3 className="text-xl font-semibold text-center mb-3 text-blue-800">Download CV</h3>
              <p className="text-center text-gray-600">Get your professionally formatted CV ready to send to employers.</p>
            </div>
            <div className="bg-blue-50 h-2"></div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-blue-800 hover:bg-blue-700 text-white px-10 py-6 text-lg shadow-lg">
            <Link href="/cv-steps">Create My CV</Link>
          </Button>
        </div>
      </section>

      {/* Popular CV Templates Section */}
      <section className="py-16 bg-neutral">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-darkText mb-4">Popular CV Templates</h2>
          <p className="text-lightText max-w-2xl mx-auto">Professional designs to showcase your skills and experience</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Kilimanjaro */}
          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img 
                src={templateImages.kilimanjaro} 
                alt="Kilimanjaro CV Template" 
                className="absolute inset-0 w-full h-full object-contain z-10"
              />
              {/* Hover Overlay with Select Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <Button 
                  variant="secondary"
                  asChild
                  className="bg-white hover:bg-gray-100 text-gray-900 text-base font-medium"
                  size="lg"
                >
                  <Link href="/templates">Select Template</Link>
                </Button>
              </div>
            </div>
            <div className="p-3 text-center border-t">
              <h3 className="font-semibold text-lg text-gray-900">Kilimanjaro</h3>
            </div>
          </div>
          
          {/* Tanzanite Pro */}
          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img 
                src={templateImages.tanzanitePro} 
                alt="Tanzanite Pro CV Template" 
                className="absolute inset-0 w-full h-full object-contain z-10"
              />
              {/* Hover Overlay with Select Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <Button 
                  variant="secondary"
                  asChild
                  className="bg-white hover:bg-gray-100 text-gray-900 text-base font-medium"
                  size="lg"
                >
                  <Link href="/templates">Select Template</Link>
                </Button>
              </div>
            </div>
            <div className="p-3 text-center border-t">
              <h3 className="font-semibold text-lg text-gray-900">Tanzanite Pro</h3>
            </div>
          </div>
          
          {/* Safari Original */}
          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img 
                src={templateImages.safariOriginal} 
                alt="Safari Original CV Template" 
                className="absolute inset-0 w-full h-full object-contain z-10"
              />
              {/* Hover Overlay with Select Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <Button 
                  variant="secondary"
                  asChild
                  className="bg-white hover:bg-gray-100 text-gray-900 text-base font-medium"
                  size="lg"
                >
                  <Link href="/templates">Select Template</Link>
                </Button>
              </div>
            </div>
            <div className="p-3 text-center border-t">
              <h3 className="font-semibold text-lg text-gray-900">Safari Original</h3>
            </div>
          </div>
          
          {/* Bright Diamond */}
          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img 
                src={templateImages.brightDiamond} 
                alt="Bright Diamond CV Template" 
                className="absolute inset-0 w-full h-full object-contain z-10"
              />
              {/* Hover Overlay with Select Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <Button 
                  variant="secondary"
                  asChild
                  className="bg-white hover:bg-gray-100 text-gray-900 text-base font-medium"
                  size="lg"
                >
                  <Link href="/templates">Select Template</Link>
                </Button>
              </div>
            </div>
            <div className="p-3 text-center border-t">
              <h3 className="font-semibold text-lg text-gray-900">Bright Diamond</h3>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
            <Link href="/templates">View more templates</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 my-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">What Our Users Say</h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">Join thousands who have transformed their career journey with our professional CV platform</p>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative">
          {/* Decorative Elements */}
          <div className="absolute -top-6 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-2">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {Array(5).fill(null).map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                    <span className="text-primary text-lg">"</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  I created my CV in less than 30 minutes using their professional templates and got called for an interview the next day! The CV was strategic and showcased my skills effectively.
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">S</div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Sarah K.</div>
                    <div className="text-sm text-gray-600">Marketing Specialist</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-2">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {Array(5).fill(null).map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                    <span className="text-primary text-lg">"</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  As a recent graduate, I needed guidance creating my first CV. The platform provided clear step-by-step instructions and ATS-friendly formatting that helped me stand out to employers.
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">M</div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Michael T.</div>
                    <div className="text-sm text-gray-600">Computer Science Graduate</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-2">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {Array(5).fill(null).map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                    <span className="text-primary text-lg">"</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  After struggling with formatting in Word for hours, I found CV Chap Chap and completed my CV in 20 minutes. Their tailored templates and industry-specific guidance made all the difference!
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Amina J.</div>
                    <div className="text-sm text-gray-600">Project Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <div className="inline-block bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <span className="text-gray-700">Join <span className="font-semibold text-primary">5,000+</span> satisfied users who created standout CVs with us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Hiring Our Customers */}
      <section className="py-16 my-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Customers Have Been Hired At</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            CVs created with CV Chap Chap have helped candidates secure positions at these leading companies
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4">
          {/* Vodacom */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <img 
              src={vodacomLogo} 
              alt="Vodacom" 
              className="max-h-12 max-w-full object-contain"
            />
          </div>
          
          {/* NMB */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <img 
              src={nmbLogo} 
              alt="NMB Bank" 
              className="max-h-12 max-w-full object-contain"
            />
          </div>
          
          {/* TCC */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <img 
              src={tccLogo} 
              alt="Tanzania Communications Commission" 
              className="max-h-12 max-w-full object-contain"
            />
          </div>
          
          {/* Jubilee */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <img 
              src={jubileeLogo} 
              alt="Jubilee Insurance" 
              className="max-h-12 max-w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Why Choose CV Chap Chap - Enhanced Content Section */}
      <section className="py-16 my-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why CV Chap Chap is East Africa's Leading CV Builder</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with deep understanding of the East African job market to create CVs that get results.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast Creation</h3>
            <p className="text-gray-600">
              Create professional CVs in under 10 minutes with our streamlined process. No more spending hours struggling with formatting - our intelligent system handles everything automatically.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">ATS-Optimized Templates</h3>
            <p className="text-gray-600">
              All our templates are designed to pass Applicant Tracking Systems (ATS) used by major employers in Tanzania, Kenya, and Uganda. Your CV will reach human recruiters, not get stuck in digital filters.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Market Expertise</h3>
            <p className="text-gray-600">
              Tailored specifically for East African job markets. We understand local hiring practices, required formats, and what employers in your region are looking for in successful candidates.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile-First Design</h3>
            <p className="text-gray-600">
              Built for African users - 90% of our customers create CVs on mobile devices. Our platform works seamlessly on any smartphone, tablet, or computer with full functionality everywhere.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Preview</h3>
            <p className="text-gray-600">
              See your CV come to life as you type. Our live preview feature shows exactly how your finished CV will look, ensuring perfect formatting and professional presentation every time.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your personal information is protected with enterprise-grade security. We never share your data with third parties, and you maintain full control over your CV content at all times.
            </p>
          </div>
        </div>
      </section>

      {/* Industry-Specific CV Guidance */}
      <section className="py-16 my-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tailored for Every Industry in East Africa</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're in finance, technology, healthcare, or any other field, our platform provides industry-specific guidance and templates that speak to employers in your sector.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <div className="text-center p-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Banking & Finance</h3>
            <p className="text-sm text-gray-600">Professional templates for NMB, CRDB, and other financial institutions</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Technology</h3>
            <p className="text-sm text-gray-600">Modern formats perfect for tech companies and startups</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Healthcare</h3>
            <p className="text-sm text-gray-600">Specialized templates for doctors, nurses, and medical professionals</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
            <p className="text-sm text-gray-600">Academic-focused designs for teachers and administrators</p>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-6">Ready to create a CV that stands out in your industry?</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/templates">Explore Industry Templates</Link>
          </Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-700 rounded-xl shadow-lg text-white text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-600/20 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Create Your Professional CV?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100">
            Join thousands of job seekers who have successfully created standout CVs with our platform. Start your career transformation today.
          </p>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-md transform -rotate-1"></div>
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-md transform rotate-1"></div>
            <Button asChild size="lg" className="relative z-10 bg-white font-semibold text-blue-800 hover:bg-blue-50 border-2 border-white/80 shadow-md px-8 py-6">
              <Link href="/cv-steps">Create Your CV Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
