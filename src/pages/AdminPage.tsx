
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AdminPage = () => {
  const { user, role } = useAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-4">
        <p className="text-lg">Welcome to the Admin Dashboard</p>
        <p>Logged in as: {user?.email} (Role: {role})</p>
        <div className="flex space-x-4">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild>
            <Link to="/staff">Staff Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
