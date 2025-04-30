import React from 'react';
import { Link } from 'wouter';
import { FiTwitter, FiFacebook, FiLinkedin } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-primary mb-4">CV Chap Chap</h2>
            <p className="text-lightText mb-4">
              Create a professional CV in minutes with our fast, easy-to-use platform. 
              No stress, no delays — just a clean, polished resume ready to help you 
              land your next opportunity faster.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-lightText hover:text-primary" aria-label="Twitter">
                <FiTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-lightText hover:text-primary" aria-label="Facebook">
                <FiFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-lightText hover:text-primary" aria-label="LinkedIn">
                <FiLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-darkText mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-lightText hover:text-primary">Home</Link>
              </li>
              <li>
                <Link href="/templates" className="text-lightText hover:text-primary">Templates</Link>
              </li>
              <li>
                <Link href="/about" className="text-lightText hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-lightText hover:text-primary">Contact</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-lightText hover:text-primary">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-darkText mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tips" className="text-lightText hover:text-primary">CV Writing Tips</Link>
              </li>
              <li>
                <Link href="/interview" className="text-lightText hover:text-primary">Interview Preparation</Link>
              </li>
              <li>
                <Link href="/career" className="text-lightText hover:text-primary">Career Advice</Link>
              </li>
              <li>
                <Link href="/help" className="text-lightText hover:text-primary">Help Center</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-lightText text-sm">&copy; {new Date().getFullYear()} CV Chap Chap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
