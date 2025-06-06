
import React from 'react';
import { CheckCircle } from 'lucide-react';

const ProcessSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How QueueFlow Works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            A seamless experience from booking to service completion
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 relative">
            {/* Step 1 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right">
                <div className="bg-blue-50 p-6 rounded-lg inline-block">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">1. Book Your Appointment</h3>
                  <p className="text-gray-700">
                    Schedule an appointment online, select your preferred location, service, and time slot.
                  </p>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex md:justify-start justify-center">
                <div className="relative">
                  <div className="hidden md:block absolute -left-4 top-1/2 w-8 h-8 bg-blue-100 rounded-full transform -translate-y-1/2"></div>
                  <div className="hidden md:block absolute -left-4 top-1/2 w-4 h-4 bg-blue-600 rounded-full transform -translate-y-1/2 ml-2"></div>
                  <div className="h-48 w-72 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-md flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-blue-700 font-medium">Booking Interface</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:order-2">
                <div className="bg-green-50 p-6 rounded-lg inline-block">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">2. Receive Confirmation</h3>
                  <p className="text-gray-700">
                    Get SMS or email confirmation with your ticket number and QR code for easy check-in.
                  </p>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex md:justify-end justify-center md:order-1">
                <div className="relative">
                  <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-8 bg-green-100 rounded-full transform -translate-y-1/2"></div>
                  <div className="hidden md:block absolute -right-4 top-1/2 w-4 h-4 bg-green-600 rounded-full transform -translate-y-1/2 mr-2"></div>
                  <div className="h-48 w-72 bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-md flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">Confirmation Sent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right">
                <div className="bg-yellow-50 p-6 rounded-lg inline-block">
                  <h3 className="text-xl font-semibold text-yellow-700 mb-2">3. Virtual Queue</h3>
                  <p className="text-gray-700">
                    Join the virtual queue and track your position and estimated wait time in real-time.
                  </p>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex md:justify-start justify-center">
                <div className="relative">
                  <div className="hidden md:block absolute -left-4 top-1/2 w-8 h-8 bg-yellow-100 rounded-full transform -translate-y-1/2"></div>
                  <div className="hidden md:block absolute -left-4 top-1/2 w-4 h-4 bg-yellow-600 rounded-full transform -translate-y-1/2 ml-2"></div>
                  <div className="h-48 w-72 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg shadow-md flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                      <p className="text-yellow-700 font-medium">Queue Tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:order-2">
                <div className="bg-purple-50 p-6 rounded-lg inline-block">
                  <h3 className="text-xl font-semibold text-purple-700 mb-2">4. Service & Feedback</h3>
                  <p className="text-gray-700">
                    Get served when it's your turn and provide feedback about your experience.
                  </p>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex md:justify-end justify-center md:order-1">
                <div className="relative">
                  <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-8 bg-purple-100 rounded-full transform -translate-y-1/2"></div>
                  <div className="hidden md:block absolute -right-4 top-1/2 w-4 h-4 bg-purple-600 rounded-full transform -translate-y-1/2 mr-2"></div>
                  <div className="h-48 w-72 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg shadow-md flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-purple-700 font-medium">Service Complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
