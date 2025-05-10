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

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-700 rounded-xl shadow-lg text-white text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-600/20 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Create Your Professional CV?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100">
            Join thousands of job seekers who have successfully created standout CVs with our platform
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
