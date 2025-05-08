import React from 'react';
import { Link } from 'wouter';
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CV Chap Chap Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-primary">CV Chap Chap</h2>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Description */}
          <div className="col-span-1">
            <h3 className="font-medium text-darkText mb-4">CV Chap Chap</h3>
            <p className="text-lightText text-sm">
              Create professional CVs in minutes with our easy-to-use platform designed for the Tanzanian job market.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-medium text-darkText mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-lightText hover:text-primary">Home</Link>
              </li>
              <li>
                <Link href="/templates" className="text-lightText hover:text-primary">Templates</Link>
              </li>
              <li>
                <Link href="/create/method" className="text-lightText hover:text-primary">Create CV</Link>
              </li>
              <li>
                <Link href="/about" className="text-lightText hover:text-primary">About Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="col-span-1">
            <h3 className="font-medium text-darkText mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-lightText hover:text-primary">FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="text-lightText hover:text-primary">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-lightText hover:text-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-lightText hover:text-primary">Terms of Service</Link>
              </li>
            </ul>
          </div>
          
          {/* Connect */}
          <div className="col-span-1">
            <h3 className="font-medium text-darkText mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-lightText hover:text-primary flex items-center">
                  <FiTwitter className="mr-2" /> Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-lightText hover:text-primary flex items-center">
                  <FiInstagram className="mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-lightText hover:text-primary flex items-center">
                  <FiLinkedin className="mr-2" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-sm text-lightText">
          <p>&copy; 2025 CV Chap Chap. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center">
            Built with <span className="text-red-500 mx-1">❤</span> by Driftmark Technologies.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
