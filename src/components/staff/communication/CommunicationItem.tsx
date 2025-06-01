
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare } from 'lucide-react';

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

interface CommunicationItemProps {
  communication: CommunicationHistory;
}

export const CommunicationItem: React.FC<CommunicationItemProps> = ({
  communication
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'default';
      case 'failed': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {communication.type === 'email' ? (
            <Mail className="h-5 w-5 text-blue-500" />
          ) : (
            <MessageSquare className="h-5 w-5 text-green-500" />
          )}
          <Badge variant={getStatusColor(communication.status)}>
            {communication.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatDate(communication.created_at)}
          </span>
        </div>
        
        <div className="text-right text-sm text-muted-foreground">
          {communication.staff && (
            <div>by {communication.staff.first_name} {communication.staff.last_name}</div>
          )}
          {communication.template_used && (
            <div className="text-xs">Template: {communication.template_used}</div>
          )}
        </div>
      </div>

      {communication.subject && (
        <div className="font-medium text-sm mb-2 text-blue-900">
          Subject: {communication.subject}
        </div>
      )}

      <div className="text-sm bg-muted/50 p-3 rounded-md">
        {communication.message}
      </div>
    </Card>
  );
};
