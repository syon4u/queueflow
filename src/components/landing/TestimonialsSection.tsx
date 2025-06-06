
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Local Resident',
      content: 'QueueFlow has completely changed how I interact with government services. No more standing in long lines - I can schedule my appointment and show up right on time.',
      rating: 5,
      location: 'Broward County'
    },
    {
      name: 'James Wilson',
      role: 'Small Business Owner',
      content: 'The real-time updates are fantastic. I can plan my day around my appointment and get back to running my business quickly.',
      rating: 5,
      location: 'Fort Lauderdale'
    },
    {
      name: 'Sarah Chen',
      role: 'Working Parent',
      content: 'As a busy mom, being able to check wait times and schedule appointments online has saved me so much time. The SMS notifications are perfect.',
      rating: 5,
      location: 'Pembroke Pines'
    },
    {
      name: 'David Thompson',
      role: 'Senior Citizen',
      content: 'The system is easy to use and the staff are always helpful. I love that I can avoid crowds and still get the help I need.',
      rating: 5,
      location: 'Hollywood'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real feedback from real people who have experienced the benefits of QueueFlow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-500 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600">{testimonial.location}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
