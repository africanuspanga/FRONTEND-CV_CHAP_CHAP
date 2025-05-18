import React from 'react';

interface MobileFormContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

/**
 * Container component optimized for mobile form display
 * Adds appropriate padding and spacing for small screens
 */
const MobileFormContainer: React.FC<MobileFormContainerProps> = ({
  children,
  className = '',
  fullWidth = false
}) => {
  return (
    <div 
      className={`
        ${fullWidth ? 'w-full' : 'max-w-md mx-auto'}
        bg-white rounded-md 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default MobileFormContainer;