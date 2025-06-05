
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface AppLayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  sidebar,
  header,
  children,
  className = ""
}) => {
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-gray-50 ${className}`}>
        {sidebar}
        <SidebarInset className="flex-1">
          {header && (
            <div className="bg-white border-b">
              {header}
            </div>
          )}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
