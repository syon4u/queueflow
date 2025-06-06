
import React from 'react';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: '2.4M+',
      label: 'Appointments Processed',
      description: 'Successfully managed appointments across all locations'
    },
    {
      icon: Clock,
      number: '85%',
      label: 'Time Saved',
      description: 'Average reduction in customer wait times'
    },
    {
      icon: CheckCircle,
      number: '98%',
      label: 'Customer Satisfaction',
      description: 'Based on post-service surveys and feedback'
    },
    {
      icon: TrendingUp,
      number: '60%',
      label: 'Efficiency Increase',
      description: 'Improved staff productivity and service delivery'
    }
  ];

  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Proven Results
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            See how QueueFlow has transformed the customer service experience 
            for thousands of organizations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-blue-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-400 transition-colors">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-xl font-semibold text-blue-100 mb-2">{stat.label}</div>
              <p className="text-blue-200 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
