
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface NewCustomerFormHeaderProps {
  onBack: () => void;
}

const NewCustomerFormHeader: React.FC<NewCustomerFormHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <h3 className="text-lg font-semibold">New Customer Appointment</h3>
    </div>
  );
};

export default NewCustomerFormHeader;
