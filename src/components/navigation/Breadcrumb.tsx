
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  showHome = true, 
  homeHref = '/',
  className 
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2 text-sm", className)}>
      {showHome && (
        <>
          <Link 
            to={homeHref} 
            className="flex items-center text-broward-navy/70 hover:text-broward-teal transition-colors"
          >
            <Home size={16} className="mr-1" />
            Home
          </Link>
          {items.length > 0 && (
            <ChevronRight size={16} className="text-broward-navy/40" />
          )}
        </>
      )}
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href && !item.isActive ? (
            <Link 
              to={item.href}
              className="text-broward-navy/70 hover:text-broward-teal transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={cn(
                "font-medium",
                item.isActive 
                  ? "text-broward-teal" 
                  : "text-broward-navy/70"
              )}
            >
              {item.label}
            </span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight size={16} className="text-broward-navy/40" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
