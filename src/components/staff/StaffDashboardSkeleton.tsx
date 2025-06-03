
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const StaffDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-5 w-32" />

      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Status Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
