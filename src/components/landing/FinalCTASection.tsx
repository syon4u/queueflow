
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FinalCTASection: React.FC = () => {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Ready to transform your queue experience?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of organizations that have improved customer satisfaction and operational efficiency with QueueFlow.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/customer">Book Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link to="/check-in">Check In</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-400 mb-1">Current Status</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">12</div>
                    <div className="text-xs text-gray-300">Current Wait (min)</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">8</div>
                    <div className="text-xs text-gray-300">People in Queue</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">5</div>
                    <div className="text-xs text-gray-300">Open Counters</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex items-center justify-center">A</div>
                    <div>
                      <div className="font-medium">Counter A</div>
                      <div className="text-xs text-gray-400">Now serving: #A1235</div>
                    </div>
                  </div>
                  <div className="text-green-400">●</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex items-center justify-center">B</div>
                    <div>
                      <div className="font-medium">Counter B</div>
                      <div className="text-xs text-gray-400">Now serving: #A1236</div>
                    </div>
                  </div>
                  <div className="text-green-400">●</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex items-center justify-center">C</div>
                    <div>
                      <div className="font-medium">Counter C</div>
                      <div className="text-xs text-gray-400">Now serving: #A1237</div>
                    </div>
                  </div>
                  <div className="text-green-400">●</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
