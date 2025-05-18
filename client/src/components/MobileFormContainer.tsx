import React, { ReactNode } from 'react';

interface MobileFormContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  fullWidth?: boolean;
}

/**
 * A container component optimized for mobile form display
 * Provides consistent styling and layout for form sections on mobile
 */
const MobileFormContainer: React.FC<MobileFormContainerProps> = ({ 
  children, 
  title, 
  subtitle, 
  className = '',
  fullWidth = false
}) => {
  return (
    <div className={`mobile-form-container bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className="mobile-form-content">
        {children}
      </div>
    </div>
  );
};

export default MobileFormContainer;