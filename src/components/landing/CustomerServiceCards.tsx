
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, Shield } from 'lucide-react';

const CustomerServiceCards: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help You Today?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get the consumer protection services you need with our convenient online tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card 
          className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
          onClick={() => handleCardClick('/customer')}
        >
          <CardContent className="p-6">
            <div className="bg-green-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Schedule an Appointment</h3>
            <p className="text-gray-600 mb-4">
              Book your visit in advance and skip the wait. Choose your preferred time and service.
            </p>
            <div className="text-green-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Get started <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
          onClick={() => handleCardClick('/customer')}
        >
          <CardContent className="p-6">
            <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Check Queue Status</h3>
            <p className="text-gray-600 mb-4">
              See current wait times and check in for walk-in services. Stay informed about your queue position.
            </p>
            <div className="text-blue-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Check status <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerServiceCards;
