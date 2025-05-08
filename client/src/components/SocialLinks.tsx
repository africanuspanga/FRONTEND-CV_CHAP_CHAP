import React from 'react';
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

/**
 * A component that displays social media connection options
 * Note: Facebook has been removed per client request
 */
const SocialLinks: React.FC = () => {
  return (
    <div className="py-4">
      <h3 className="font-medium text-gray-900 mb-3">Connect</h3>
      <ul className="space-y-3">
        <li>
          <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center">
            <FiTwitter className="mr-2" /> Twitter
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center">
            <FiInstagram className="mr-2" /> Instagram
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center">
            <FiLinkedin className="mr-2" /> LinkedIn
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SocialLinks;