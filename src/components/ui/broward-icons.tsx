import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const ShieldIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`icon ${className}`}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
};

export const HandshakeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`icon ${className}`}
      aria-hidden="true"
    >
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
    </svg>
  );
};

export const DocumentIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`icon ${className}`}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
};

export const CheckIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`icon ${className}`}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export const ShieldCheckmarkAnimation: React.FC<IconProps> = ({ className = '', size = 80 }) => {
  return (
    <div 
      className={`shield-checkmark ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    >
      <div className="shield"></div>
      <div className="checkmark"></div>
    </div>
  );
};

export const LandmarkCourthouse: React.FC<IconProps> = ({ className = '', size = 120 }) => {
  return (
    <div 
      className={`landmark-illustration landmark-courthouse ${className}`}
      style={{ height: `${size}px` }}
      aria-hidden="true"
    />
  );
};

export const LandmarkBeach: React.FC<IconProps> = ({ className = '', size = 120 }) => {
  return (
    <div 
      className={`landmark-illustration landmark-beach ${className}`}
      style={{ height: `${size}px` }}
      aria-hidden="true"
    />
  );
};

export const LandmarkPort: React.FC<IconProps> = ({ className = '', size = 120 }) => {
  return (
    <div 
      className={`landmark-illustration landmark-port ${className}`}
      style={{ height: `${size}px` }}
      aria-hidden="true"
    />
  );
};