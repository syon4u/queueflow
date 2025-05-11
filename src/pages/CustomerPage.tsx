
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CustomerPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
      <div className="space-y-4">
        <p className="text-lg">Welcome to the Customer Dashboard</p>
        <div className="flex space-x-4">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
