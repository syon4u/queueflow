
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CommunicationHistory {
  id: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  template_used?: string;
  customer_id: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface RetryFailedMessagesProps {
  failedMessages: CommunicationHistory[];
  onRetryComplete: () => void;
}

export const RetryFailedMessages: React.FC<RetryFailedMessagesProps> = ({
  failedMessages,
  onRetryComplete
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [retryResults, setRetryResults] = useState<Record<string, boolean>>({});

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === failedMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(failedMessages.map(msg => msg.id));
    }
  };

  const handleRetryMessages = async () => {
    if (selectedMessages.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one message to retry'
      });
      return;
    }

    setIsRetrying(true);
    const results: Record<string, boolean> = {};

    for (const messageId of selectedMessages) {
      const message = failedMessages.find(msg => msg.id === messageId);
      if (!message) continue;

      try {
        const { error } = await supabase.functions.invoke('send-communication', {
          body: {
            customerId: message.customer_id,
            type: message.type,
            subject: message.subject,
            message: message.message,
            templateId: message.template_used
          }
        });

        if (error) throw error;

        // Update the original message status to indicate retry
        await supabase
          .from('customer_communications')
          .update({ 
            status: 'retried',
            updated_at: new Date().toISOString()
          })
          .eq('id', messageId);

        results[messageId] = true;
      } catch (error) {
        console.error(`Error retrying message ${messageId}:`, error);
        results[messageId] = false;
      }
    }

    setRetryResults(results);
    setIsRetrying(false);

    const successCount = Object.values(results).filter(Boolean).length;
    const failCount = Object.values(results).filter(r => !r).length;

    toast({
      title: 'Retry Complete',
      description: `${successCount} messages sent successfully, ${failCount} failed`
    });

    if (successCount > 0) {
      onRetryComplete();
    }
  };

  if (failedMessages.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
        <p className="text-muted-foreground">No failed messages to retry</p>
      </Card>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry Failed Messages ({failedMessages.length})
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Retry Failed Messages
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {failedMessages.length} failed messages found
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedMessages.length === failedMessages.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {failedMessages.map((message) => (
                <Card key={message.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleSelectMessage(message.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">Failed</Badge>
                        <Badge variant="outline">
                          {message.type.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      {message.subject && (
                        <p className="font-medium text-sm mb-1">
                          Subject: {message.subject}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.message}
                      </p>
                      {retryResults[message.id] !== undefined && (
                        <div className="mt-2">
                          {retryResults[message.id] ? (
                            <Badge variant="default">Retry Successful</Badge>
                          ) : (
                            <Badge variant="destructive">Retry Failed</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRetryMessages} 
              disabled={isRetrying || selectedMessages.length === 0}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Selected ({selectedMessages.length})
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
