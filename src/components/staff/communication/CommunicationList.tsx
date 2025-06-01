
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { CommunicationItem } from './CommunicationItem';

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

interface CommunicationListProps {
  communications: CommunicationHistory[];
  isLoading: boolean;
  searchTerm: string;
  typeFilter: string;
  statusFilter: string;
}

export const CommunicationList: React.FC<CommunicationListProps> = ({
  communications,
  isLoading,
  searchTerm,
  typeFilter,
  statusFilter
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading communications...</p>
      </div>
    );
  }

  if (communications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No communications found</p>
        <p className="text-sm">
          {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
            ? 'Try adjusting your filters'
            : 'No messages have been sent to this customer yet'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {communications.map((comm) => (
        <CommunicationItem key={comm.id} communication={comm} />
      ))}
    </div>
  );
};
