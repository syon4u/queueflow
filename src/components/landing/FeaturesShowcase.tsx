
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Shield, BarChart3, Calendar, Bell, MapPin, Smartphone } from 'lucide-react';

const FeaturesShowcase: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Get live updates on wait times and queue position through SMS and web notifications.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Book appointments in advance and choose your preferred time slot to avoid waiting.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Queue Management',
      description: 'Join virtual queues from anywhere and track your position in real-time.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Bell,
      title: 'Instant Notifications',
      description: 'Receive alerts when it\'s almost your turn, so you never miss your appointment.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your personal information is protected with enterprise-grade security measures.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Staff can track performance metrics and optimize service delivery.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: MapPin,
      title: 'Multi-Location',
      description: 'Manage appointments across multiple locations from a single platform.',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Optimized mobile experience for customers and staff on any device.',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our queue management system is designed to make your experience smoother, 
            whether you're a customer or staff member.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6 text-center">
                {/* Icon with Gradient Background */}
                <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              From appointment scheduling to real-time queue management, we've got you covered with cutting-edge technology and intuitive design.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                Cloud-Based
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                99.9% Uptime
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                HIPAA Compliant
              </div>
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
