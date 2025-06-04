
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';

interface PWAInstallPromptProps {
  onDismiss: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onDismiss }) => {
  const { isInstallable, installApp } = usePWA();

  if (!isInstallable) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      onDismiss();
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 md:left-auto md:right-4 md:w-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-900">Install QueueFlow</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 hover:bg-blue-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-blue-700">
          Get quick access to queue status and faster check-ins
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Join queues remotely</li>
            <li>• Real-time position updates</li>
            <li>• Works offline</li>
          </ul>
          <Button 
            onClick={handleInstall}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
