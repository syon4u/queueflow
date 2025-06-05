
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Heading Components
export const Heading: React.FC<TypographyProps & { variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' }> = ({
  children,
  className,
  variant = 'md',
  as = 'h2',
  ...props
}) => {
  const Component = as;
  const variantClasses = {
    'xs': 'text-heading-xs',
    'sm': 'text-heading-sm',
    'md': 'text-heading-md',
    'lg': 'text-heading-lg',
    'xl': 'text-heading-xl',
    '2xl': 'text-heading-2xl',
  };

  return (
    <Component
      className={cn(variantClasses[variant], 'text-foreground', className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Text Components
export const Text: React.FC<TypographyProps & { variant?: 'xs' | 'sm' | 'md' | 'lg' }> = ({
  children,
  className,
  variant = 'md',
  as = 'p',
  ...props
}) => {
  const Component = as;
  const variantClasses = {
    'xs': 'text-body-xs',
    'sm': 'text-body-sm',
    'md': 'text-body-md',
    'lg': 'text-body-lg',
  };

  return (
    <Component
      className={cn(variantClasses[variant], 'text-foreground', className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Caption/Muted Text
export const Caption: React.FC<TypographyProps> = ({
  children,
  className,
  as = 'span',
  ...props
}) => {
  const Component = as;
  
  return (
    <Component
      className={cn('text-body-xs text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Component>
  );
};

// Label Component
export const Label: React.FC<TypographyProps> = ({
  children,
  className,
  as = 'label',
  ...props
}) => {
  const Component = as;
  
  return (
    <Component
      className={cn('text-body-sm font-medium text-foreground', className)}
      {...props}
    >
      {children}
    </Component>
  );
};
