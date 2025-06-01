import React from 'react';
import { Slot } from '@radix-ui/react-slot';

interface BrowardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

const BrowardButton: React.FC<BrowardButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  asChild = false,
  ...props
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline'
  };
  
  const sizeClasses = {
    sm: 'text-sm py-1 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const Comp = asChild ? Slot : 'button';
  
  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
};

export default BrowardButton;