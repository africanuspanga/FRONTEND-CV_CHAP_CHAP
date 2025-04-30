import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, User, FileText, Layout, LogOut } from 'lucide-react';

interface UserProfileMenuProps {
  username: string;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Here you would handle the logout logic
    console.log('Logging out...');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 text-indigo-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-5 w-5" />
        <span className="uppercase">{username}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
          <div className="py-2 border-b">
            <div className="px-4 py-2 font-medium text-indigo-900">My Account</div>
          </div>
          
          <div className="py-1">
            <button
              className="flex items-center w-full px-4 py-2 text-left text-indigo-900 hover:bg-gray-100"
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
            >
              <User className="h-4 w-4 mr-3" />
              Profile
            </button>
            
            <button
              className="flex items-center w-full px-4 py-2 text-left text-indigo-900 hover:bg-gray-100"
              onClick={() => {
                navigate('/my-cvs');
                setIsOpen(false);
              }}
            >
              <FileText className="h-4 w-4 mr-3" />
              My CVs
            </button>
            
            <button
              className="flex items-center w-full px-4 py-2 text-left text-indigo-900 hover:bg-gray-100"
              onClick={() => {
                navigate('/templates');
                setIsOpen(false);
              }}
            >
              <Layout className="h-4 w-4 mr-3" />
              Templates
            </button>
          </div>
          
          <div className="py-1 border-t">
            <button
              className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;