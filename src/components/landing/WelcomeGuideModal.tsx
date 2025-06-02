
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className="max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">Welcome to QueueFlow</h3>
          <p className="mb-4 text-gray-600">
            QueueFlow helps you manage your time better by allowing you to schedule appointments in advance or check wait times for walk-in services. No more standing in long lines!
          </p>
          <Button 
            onClick={onClose} 
            className="w-full"
          >
            Got it
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeGuideModal;
