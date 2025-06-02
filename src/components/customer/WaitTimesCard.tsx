
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';

const WaitTimesCard = () => {
  // Sample wait times data for anonymous display
  const waitTimes = [
    { location: 'Main Office', time: '15 min', status: 'normal' },
    { location: 'Downtown Branch', time: '25 min', status: 'busy' },
    { location: 'North Office', time: '10 min', status: 'light' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'light': return 'text-green-600';
      case 'normal': return 'text-yellow-600';
      case 'busy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Current Wait Times
        </CardTitle>
        <CardDescription>
          Estimated wait times at our locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {waitTimes.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{location.location}</span>
              </div>
              <div className={`font-semibold ${getStatusColor(location.status)}`}>
                {location.time}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Wait times are estimates and may vary
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitTimesCard;
