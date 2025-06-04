
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Camera, AlertCircle } from 'lucide-react';

interface QRCodeScannerProps {
  onScanSuccess: (data: string) => void;
  onError: (error: string) => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ 
  onScanSuccess, 
  onError 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        startScanning();
      }
    } catch (err) {
      const errorMsg = 'Camera access denied or unavailable';
      setError(errorMsg);
      onError(errorMsg);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const startScanning = () => {
    const scanQRCode = () => {
      if (!isScanning || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context || video.videoWidth === 0) {
        requestAnimationFrame(scanQRCode);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple QR code detection would go here
      // For now, we'll simulate with a manual input fallback
      
      requestAnimationFrame(scanQRCode);
    };

    requestAnimationFrame(scanQRCode);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualInput = () => {
    const input = prompt('Enter ticket ID or QR code data:');
    if (input) {
      onScanSuccess(input);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-gray-100 rounded-lg object-cover"
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Camera preview will appear here</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {!isScanning ? (
            <Button onClick={startCamera} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="w-full">
              Stop Camera
            </Button>
          )}
          
          <Button 
            onClick={handleManualInput} 
            variant="outline" 
            className="w-full"
          >
            Enter Manually
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Position the QR code within the camera frame</p>
          <p>Make sure there's adequate lighting</p>
        </div>
      </CardContent>
    </Card>
  );
};
