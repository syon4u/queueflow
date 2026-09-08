
import React from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  headerTitle,
  headerSubtitle,
  className = ""
}) => {
  return (
    <div className={`min-h-screen w-full flex flex-col ${className}`}>
      {showHeader && (
        <SiteHeader 
          title={headerTitle}
          subtitle={headerSubtitle}
        />
      )}
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      {showFooter && <SiteFooter />}
    </div>
  );
};

export default PageLayout;
