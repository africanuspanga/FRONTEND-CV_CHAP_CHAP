import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { templateImages } from '@/lib/template-images';
// Import the hero image
import heroWomanImage from '@assets/Professional Confidence in a Chic Setting (1).png';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-darkText mb-6">Create Your Professional CV in Minutes</h1>
            <p className="text-lg text-lightText mb-8">
              Build a standout CV that gets you noticed. Our easy-to-use platform helps you create a professional CV quickly and efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="px-8">
                <Link href="/create/method">Build New CV</Link>
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
      <section className="py-16 bg-neutral rounded-lg my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-darkText mb-4">How It Works</h2>
          <p className="text-lightText max-w-2xl mx-auto">Create your professional CV in three simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white border-none shadow-md">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">1</div>
              <h3 className="text-xl font-semibold text-center mb-2">Select Template</h3>
              <p className="text-center text-lightText">Choose from our professional CV templates designed to impress employers.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-none shadow-md">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">2</div>
              <h3 className="text-xl font-semibold text-center mb-2">Fill Details</h3>
              <p className="text-center text-lightText">Enter your information using our guided step-by-step form process.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-none shadow-md">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">3</div>
              <h3 className="text-xl font-semibold text-center mb-2">Download CV</h3>
              <p className="text-center text-lightText">Get your professionally formatted CV ready to send to employers.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/create/method">Get Started</Link>
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
          {/* Moonlight Sonata */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[350px] bg-gray-50 flex items-center justify-center p-3">
              <img 
                src={templateImages.moonlightSonata} 
                alt="Moonlight Sonata CV Template" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-medium text-lg">Moonlight Sonata</h3>
            </div>
          </div>
          
          {/* Kilimanjaro */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[350px] bg-gray-50 flex items-center justify-center p-3">
              <img 
                src={templateImages.kilimanjaro} 
                alt="Kilimanjaro CV Template" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-medium text-lg">Kilimanjaro</h3>
            </div>
          </div>
          
          {/* Bright Diamond */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[350px] bg-gray-50 flex items-center justify-center p-3">
              <img 
                src={templateImages.brightDiamond} 
                alt="Bright Diamond CV Template" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-medium text-lg">Bright Diamond</h3>
            </div>
          </div>
          
          {/* Mjenzi wa Taifa */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[350px] bg-gray-50 flex items-center justify-center p-3">
              <img 
                src={templateImages.mjenziWaTaifa} 
                alt="Mjenzi wa Taifa CV Template" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-medium text-lg">Mjenzi wa Taifa</h3>
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
      <section className="py-16 bg-gray-50 rounded-lg my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-darkText mb-4">What Our Users Say</h2>
          <p className="text-lightText max-w-2xl mx-auto">Join thousands who have created professional CVs with our platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                "I created my CV in less than 30 minutes and got called for an interview the next day! The templates are really professional."
              </p>
              <div className="font-medium">Sarah K.</div>
              <div className="text-sm text-gray-500">Marketing Specialist</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                "As a recent graduate, I needed help creating my first CV. This platform made it so easy with clear guidance at each step."
              </p>
              <div className="font-medium">Michael T.</div>
              <div className="text-sm text-gray-500">Computer Science Graduate</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                "After struggling with formatting in Word for hours, I found this site and completed my CV in 20 minutes. The templates are beautiful!"
              </p>
              <div className="font-medium">Amina J.</div>
              <div className="text-sm text-gray-500">Project Manager</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary rounded-lg text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Create Your Professional CV?</h2>
        <p className="max-w-2xl mx-auto mb-8">Join thousands of job seekers who have successfully created standout CVs with our platform</p>
        <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
          <Link href="/create/method">Create Your CV Now</Link>
        </Button>
      </section>
    </div>
  );
};

export default Home;
