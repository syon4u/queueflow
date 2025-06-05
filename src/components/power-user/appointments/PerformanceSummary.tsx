
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PerformanceSummaryProps {
  completionRate: number;
  activeCustomers: number;
  queueLength: number;
  totalCustomers: number;
}

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  completionRate,
  activeCustomers,
  queueLength,
  totalCustomers
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Performance Today
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Completion Rate</span>
          <span className="font-semibold text-gray-900">{completionRate}%</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Active Customers</span>
          <span className="font-semibold text-gray-900">{activeCustomers}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Queue Length</span>
          <span className="font-semibold text-gray-900">{queueLength}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Total Customers</span>
          <span className="font-semibold text-gray-900">{totalCustomers}</span>
        </div>
      </CardContent>
    </Card>
  );
};
