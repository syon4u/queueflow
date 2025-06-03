
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const StaffStatusSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
      
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
};
