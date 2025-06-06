
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Smartphone, Clock, BarChart3 } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">A Complete Queue Management Solution</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            QueueFlow handles every aspect of customer flow, from booking to completion, with powerful tools for both customers and staff.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="transition-all duration-300 hover:shadow-md border-0 shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">Omni-Channel Booking</CardTitle>
              <p className="text-gray-600">
                Book appointments via web, mobile, kiosk, or phone, with flexible scheduling options.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md border-0 shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">Virtual Queue</CardTitle>
              <p className="text-gray-600">
                Join remotely and receive real-time updates about your position and wait time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md border-0 shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">Smart Wait Time</CardTitle>
              <p className="text-gray-600">
                AI-powered predictions for accurate wait times and capacity management.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md border-0 shadow-sm">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">Rich Analytics</CardTitle>
              <p className="text-gray-600">
                Comprehensive dashboards and reports for optimizing staff and service levels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
