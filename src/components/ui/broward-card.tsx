import React from 'react';

interface BrowardCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  elevation?: 'sm' | 'md' | 'lg';
}

const BrowardCard: React.FC<BrowardCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  elevation = 'md'
}) => {
  const elevationClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  return (
    <div className={`card ${elevationClasses[elevation]} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-serif text-bc-navy dark:text-bc-blue">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default BrowardCard;