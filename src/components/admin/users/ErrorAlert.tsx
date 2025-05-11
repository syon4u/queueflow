
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorAlertProps {
  error: Error | unknown;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Error loading users: {errorMessage}
      </AlertDescription>
    </Alert>
  );
};
