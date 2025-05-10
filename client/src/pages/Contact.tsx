import React from 'react';
import { Helmet } from 'react-helmet';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const Contact: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | CV Chap Chap</title>
        <meta 
          name="description" 
          content="Get in touch with CV Chap Chap for any inquiries about our CV writing and job application services. We're available Monday to Saturday, 9AM to 5PM EAT."
        />
        <link rel="canonical" href="https://cvchapchap.com/contact" />
      </Helmet>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">Contact Us</h1>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-2xl mx-auto">
          <div className="flex flex-col items-center p-8 text-center">
            {/* Flag and Country */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border border-gray-200 flex items-center justify-center">
                <svg viewBox="0 0 640 480" className="w-full h-full">
                  <g fillRule="evenodd" strokeWidth="1pt">
                    <path fill="#09f" d="M0 0h640v480H0z"/>
                    <path fill="#090" d="M0 0h640v320H0z"/>
                    <path d="M0 0h640v240H0z"/>
                    <path fill="#ff0" d="M0 0h640v160H0z"/>
                    <path d="M640 0H0v480l640-480z" fill="#000"/>
                    <path d="M0 0l640 480H0V0z" fill="#ff0"/>
                  </g>
                </svg>
              </div>
              <div className="bg-primary/10 text-primary font-bold py-2 px-8 rounded-full text-xl">
                TANZANIA
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6 w-full max-w-md">
              {/* Phone */}
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-6 w-6 text-primary" />
                <a href="tel:+255793166375" className="text-2xl font-bold text-primary hover:underline">
                  +255 793 166 375
                </a>
              </div>
              
              {/* WhatsApp */}
              <div className="flex items-center justify-center gap-3">
                <FaWhatsapp className="h-6 w-6 text-green-500" />
                <a 
                  href="https://wa.me/255793166375" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl font-bold text-primary hover:underline"
                >
                  +255 793 166 375
                </a>
              </div>
              
              {/* Email */}
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <a 
                  href="mailto:driftmarklabs@gmail.com" 
                  className="text-xl font-bold text-primary hover:underline"
                >
                  driftmarklabs@gmail.com
                </a>
              </div>
              
              {/* Hours */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">Business Hours</span>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold mb-2">Monday – Saturday</p>
                  <p className="text-xl font-bold text-primary mb-6">9:00 AM – 5:00 PM EAT</p>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="mt-6 w-full">
              <a 
                href="https://wa.me/255793166375" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-md text-center transition-colors flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="h-5 w-5" />
                Chat with Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-4">Visit Our Office</h2>
          <p className="text-gray-700 mb-6">
            Want to meet in person? Visit our office in Dar es Salaam, Tanzania. 
            Our team is ready to help you craft the perfect CV for your career goals.
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <address className="not-italic text-lg">
              Makumbusho Street, Dar es Salaam, Tanzania
            </address>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;