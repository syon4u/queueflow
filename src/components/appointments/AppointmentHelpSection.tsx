
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AppointmentHelpSection: React.FC = () => {
  return (
    <div className="mt-8 text-center">
      <Card className="bg-brand-sand/20 border-brand-teal/30">
        <CardContent className="p-6">
          <h4 className="font-semibold text-brand-navy mb-2">Need Help?</h4>
          <p className="text-brand-navy/70 mb-4">
            If you need assistance with scheduling your appointment, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Phone:</span>
              <span>(954) 357-8000</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Email:</span>
              <span>info@garrickinternational.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentHelpSection;
