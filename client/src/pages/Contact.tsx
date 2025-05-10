import React from 'react';
import { Helmet } from 'react-helmet';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import flagImage from '@assets/flag-round-250.png';

const Contact: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact CV Chap Chap | Expert CV & Job Application Support in Tanzania</title>
        <meta 
          name="description" 
          content="Need CV writing or job application help? Contact CV Chap Chap in Tanzania for professional guidance. WhatsApp, call or email us for fast service on CVs, application letters, and career advice."
        />
        <meta 
          name="keywords" 
          content="CV help Tanzania, contact CV writer, professional CV services, Dar es Salaam CV services, job application help Tanzania, CV writing contact, mawasiliano CV, msaada wa CV"
        />
        <meta property="og:title" content="Contact CV Chap Chap | Expert CV & Job Application Support in Tanzania" />
        <meta property="og:description" content="Need CV writing or job application help? Contact CV Chap Chap in Tanzania for professional guidance. Available via WhatsApp, phone or email." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://cvchapchap.com/contact" />
      </Helmet>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">Contact Us</h1>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-2xl mx-auto">
          <div className="flex flex-col items-center p-8 text-center">
            {/* Flag and Country */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border border-gray-200">
                <img 
                  src={flagImage} 
                  alt="Tanzania Flag" 
                  className="w-full h-full object-cover"
                />
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