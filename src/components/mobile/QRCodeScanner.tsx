
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Camera, X, Keyboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface QRCodeScannerProps {
  onScan?: (appointmentId: string) => void;
  onClose?: () => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onClose
}) => {
  const [manualEntry, setManualEntry] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (scanning && videoRef.current) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Access Denied',
        description: 'Please enable camera access or use manual entry.',
        variant: 'destructive',
      });
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationCode.trim()) {
      const appointmentId = confirmationCode.trim().toLowerCase();
      handleScanResult(appointmentId);
    }
  };

  const handleScanResult = (appointmentId: string) => {
    onScan?.(appointmentId);
    navigate(`/mobile-queue?appointment=${appointmentId}`);
    toast({
      title: 'Queue Position Found',
      description: 'Loading your current position...',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-white font-semibold">Scan Queue Ticket</h1>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Camera View */}
      {scanning && !manualEntry && (
        <div className="relative h-screen">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Scan Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 border-2 border-white rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
              </div>
              <p className="text-white text-center mt-4">
                Position QR code within the frame
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Mode */}
      {manualEntry && (
        <div className="pt-20 p-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Enter Confirmation Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="confirmation-code">
                      Confirmation Code
                    </Label>
                    <Input
                      id="confirmation-code"
                      type="text"
                      placeholder="Enter your confirmation code"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Find this on your appointment confirmation
                    </p>
                  </div>
                  <Button type="submit" className="w-full">
                    Find My Position
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/50 backdrop-blur-sm">
        <div className="flex justify-center gap-4">
          {!scanning && !manualEntry && (
            <>
              <Button
                onClick={() => setScanning(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-5 w-5 mr-2" />
                Scan QR Code
              </Button>
              <Button
                onClick={() => setManualEntry(true)}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Keyboard className="h-5 w-5 mr-2" />
                Manual Entry
              </Button>
            </>
          )}

          {scanning && (
            <Button
              onClick={() => setScanning(false)}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Cancel Scan
            </Button>
          )}

          {manualEntry && (
            <Button
              onClick={() => setManualEntry(false)}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Use Camera
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
