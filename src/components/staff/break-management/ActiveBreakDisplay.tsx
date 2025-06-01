
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';
import { BreakRequest } from '@/types/break-management';

interface ActiveBreakDisplayProps {
  currentBreak: BreakRequest;
  onEndBreak: () => Promise<void>;
}

export const ActiveBreakDisplay: React.FC<ActiveBreakDisplayProps> = ({
  currentBreak,
  onEndBreak
}) => {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Coffee className="h-5 w-5" />
          Currently on Break
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{currentBreak.breakType.charAt(0).toUpperCase() + currentBreak.breakType.slice(1)} Break</p>
            <p className="text-sm text-muted-foreground">Duration: {currentBreak.duration} minutes</p>
            {currentBreak.handoverStaffId && (
              <p className="text-sm text-orange-700">Coverage provided by handover staff</p>
            )}
          </div>
          <Button 
            onClick={onEndBreak}
            className="bg-orange-600 hover:bg-orange-700"
          >
            End Break Early
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
