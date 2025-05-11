
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { LocationsTab } from '@/components/admin/LocationsTab';
import { ServicesTab } from '@/components/admin/ServicesTab';
import { StaffTab } from '@/components/admin/StaffTab';
import { StatsTab } from '@/components/admin/StatsTab';

const AdminPage = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('locations');
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Logged in as: {user?.email} (Role: {role})
        </div>
      </div>

      <Tabs defaultValue="locations" onValueChange={setActiveTab} value={activeTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="p-6">
            <TabsContent value="locations">
              <LocationsTab />
            </TabsContent>
            <TabsContent value="services">
              <ServicesTab />
            </TabsContent>
            <TabsContent value="staff">
              <StaffTab />
            </TabsContent>
            <TabsContent value="stats">
              <StatsTab />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      <div className="flex space-x-4 mt-6">
        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/staff">Staff Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
