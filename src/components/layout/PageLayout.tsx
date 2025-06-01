
import React from 'react';
import BrowardHeader from './BrowardHeader';
import BrowardFooter from './BrowardFooter';

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
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showHeader && (
        <BrowardHeader 
          title={headerTitle}
          subtitle={headerSubtitle}
        />
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <BrowardFooter />}
    </div>
  );
};

export default PageLayout;
