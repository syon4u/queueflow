
import React from 'react';
import { Card } from '@/components/ui/card';

interface CommunicationHistory {
  id: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  template_used?: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface CommunicationStatisticsProps {
  communications: CommunicationHistory[];
}

export const CommunicationStatistics: React.FC<CommunicationStatisticsProps> = ({
  communications
}) => {
  if (communications.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">{communications.length}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-500">
            {communications.filter(c => c.type === 'email').length}
          </div>
          <div className="text-sm text-muted-foreground">Emails</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-500">
            {communications.filter(c => c.type === 'sms').length}
          </div>
          <div className="text-sm text-muted-foreground">SMS</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-500">
            {communications.filter(c => c.status === 'failed').length}
          </div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
      </div>
    </Card>
  );
};
