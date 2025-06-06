
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Shield, BarChart3, Calendar, Bell } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Get live updates on wait times and queue position through SMS and web notifications.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Book appointments in advance and choose your preferred time slot to avoid waiting.'
    },
    {
      icon: Users,
      title: 'Queue Management',
      description: 'Join virtual queues from anywhere and track your position in real-time.'
    },
    {
      icon: Bell,
      title: 'Instant Notifications',
      description: 'Receive alerts when it\'s almost your turn, so you never miss your appointment.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your personal information is protected with enterprise-grade security measures.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Staff can track performance metrics and optimize service delivery.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features for Everyone
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our queue management system is designed to make your experience smoother, 
            whether you're a customer or staff member.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
