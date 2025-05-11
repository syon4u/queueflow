
import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const QueueHeader: React.FC = () => {
  const { stats, resetQueue } = useQueue();
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-qflow-blue">
          QueueFlow
          <span className="text-qflow-teal">.</span>
        </h1>
        <p className="text-muted-foreground">
          Managing {stats.totalCustomers} customer{stats.totalCustomers !== 1 ? 's' : ''}
          {stats.waitingCustomers > 0 && ` • ${stats.waitingCustomers} waiting`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCcw size={14} />
              <span>Reset Queue</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Reset Queue</span>
              </DialogTitle>
              <DialogDescription>
                This will remove all customers from the queue. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  resetQueue();
                  setIsResetDialogOpen(false);
                }}
              >
                Reset Queue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QueueHeader;
