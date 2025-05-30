
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to customer page
    navigate('/customer');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Queue Flow</CardTitle>
          <CardDescription>Welcome to the queue management system</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => navigate('/customer')} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Customer Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
