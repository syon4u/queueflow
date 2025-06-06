
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
      <div className={`min-h-screen flex w-full ${className}`}>
        {sidebar}
        <SidebarInset className="flex-1 w-full">
          {header && (
            <div className="bg-white border-b w-full">
              {header}
            </div>
          )}
          <main className="flex-1 p-6 w-full">
            <div className="w-full mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
