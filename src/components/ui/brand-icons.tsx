import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const ShieldIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <div 
      className={`icon icon-shield ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    />
  );
};

export const HandshakeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <div 
      className={`icon icon-handshake ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    />
  );
};

export const DocumentIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <div 
      className={`icon icon-document ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    />
  );
};

export const CheckIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <div 
      className={`icon icon-check ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    />
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
