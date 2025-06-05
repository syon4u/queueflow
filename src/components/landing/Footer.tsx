
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface FooterProps {
  onShowStaffAccess: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowStaffAccess }) => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">Queue Flow</span>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact Support</a>
            <Button variant="ghost" size="sm" onClick={onShowStaffAccess} className="text-white hover:text-blue-400">
              Employee Login
            </Button>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 Queue Flow. All rights reserved. | Broward County Queue Management System</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
