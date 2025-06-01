import React from 'react';
import BrowardHeader from './BrowardHeader';
import BrowardFooter from './BrowardFooter';

interface BrowardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

const BrowardLayout: React.FC<BrowardLayoutProps> = ({ 
  children, 
  headerTitle,
  headerSubtitle
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <BrowardHeader title={headerTitle} subtitle={headerSubtitle} />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <BrowardFooter />
    </div>
  );
};

export default BrowardLayout;