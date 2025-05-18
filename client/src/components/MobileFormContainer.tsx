import React from 'react';
import { cn } from '@/lib/utils';

interface MobileFormContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

/**
 * A container component optimized for forms on mobile devices
 * Provides consistent spacing, padding, and width constraints
 */
const MobileFormContainer: React.FC<MobileFormContainerProps> = ({ 
  children, 
  className,
  fullWidth = false
}) => {
  return (
    <div 
      className={cn(
        'mobile-form-container py-4',
        fullWidth ? 'w-full max-w-full' : 'w-full max-w-md',
        className
      )}
    >
      {children}
    </div>
  );
};

export default MobileFormContainer;