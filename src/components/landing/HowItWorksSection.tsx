
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Bell, Smartphone } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three simple steps to transform your waiting experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Step 1 */}
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <CardTitle className="text-xl">Book</CardTitle>
              <CardDescription>Choose your service & preferred time</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Select from available slots that work with your schedule</p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <CardTitle className="text-xl">Track</CardTitle>
              <CardDescription>Get real-time SMS & email updates</CardDescription>
            </CardHeader>
            <CardContent>
              <Bell className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Stay informed with live wait times and notifications</p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <CardTitle className="text-xl">Check In</CardTitle>
              <CardDescription>Tap once, skip the reception line</CardDescription>
            </CardHeader>
            <CardContent>
              <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Seamless arrival with contactless check-in</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
