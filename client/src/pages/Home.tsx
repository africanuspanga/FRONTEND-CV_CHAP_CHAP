import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 24 24' fill='none' stroke='%236D8CFF' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E"
                alt="CV Document Illustration"
                className="relative z-10 w-full h-auto rounded-lg shadow-lg"
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

      {/* Featured Templates Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-darkText mb-4">Featured Templates</h2>
          <p className="text-lightText max-w-2xl mx-auto">Professional designs to showcase your skills and experience</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Template Preview Cards */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
              <div className="w-full h-full bg-orange-100 rounded border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-orange-400"></div>
                <div className="absolute top-4 left-4 right-4 text-white">
                  <div className="text-lg font-bold">JOHN DOE</div>
                  <div className="text-xs mt-1 border-t border-white pt-1">WEB DEVELOPER</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium">Moonlight Sonata</h3>
              <p className="text-sm text-gray-600">Modern template with warm orange sidebar</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
              <div className="w-full h-full bg-blue-50 rounded border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-16 bg-primary"></div>
                <div className="absolute top-20 left-4 right-4">
                  <div className="text-lg font-bold text-darkText">JOHN DOE</div>
                  <div className="text-xs text-primary mt-1">Web Developer</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium">Tanzanite</h3>
              <p className="text-sm text-gray-600">Professional blue header template</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
              <div className="w-full h-full bg-amber-50 rounded border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-amber-700"></div>
                <div className="absolute top-8 left-0 w-32 h-32 rounded-full bg-white ml-4 border-4 border-amber-700"></div>
                <div className="absolute top-28 left-40 right-4">
                  <div className="text-lg font-bold text-darkText">John Doe</div>
                  <div className="text-xs text-amber-700 mt-1">Web Developer</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium">Safari Pro</h3>
              <p className="text-sm text-gray-600">Bold design with earthy tones</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
              <div className="w-full h-full bg-gray-100 rounded border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 text-center pt-8">
                  <div className="text-xl font-bold text-darkText uppercase">John Doe</div>
                  <div className="text-sm text-gray-600 mt-1">Web Developer</div>
                  <div className="mx-auto w-16 h-0.5 bg-primary mt-2"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium">Mwalimu Classic</h3>
              <p className="text-sm text-gray-600">Traditional academic style</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="outline">
            <Link href="/templates">View All Templates</Link>
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
