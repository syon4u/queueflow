import React from 'react';

interface BrandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  floating?: boolean;
  className?: string;
}

const BrandInput: React.FC<BrandInputProps> = ({
  label,
  error,
  floating = true,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  if (floating) {
    return (
      <div className={`form-group ${className}`}>
        <div className="floating-label">
          <input
            id={inputId}
            className={`form-input ${error ? 'border-error' : ''}`}
            placeholder=" "
            {...props}
          />
          <label htmlFor={inputId}>{label}</label>
        </div>
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>
    );
  }
  
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={inputId} className="form-label">{label}</label>
      <input
        id={inputId}
        className={`form-input ${error ? 'border-error' : ''}`}
        {...props}
      />
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default BrandInput;