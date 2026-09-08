import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocationsTab } from '@/components/admin/LocationsTab';
import { ServicesTab } from '@/components/admin/ServicesTab';

/**
 * Power User → Locations & Services.
 *
 * This tab used to render a read-only table whose Create / Edit / Delete
 * buttons only showed a "form would open here" toast. The admin LocationsTab
 * and ServicesTab already implement the real CRUD (with dialogs and
 * Supabase writes) but were not mounted anywhere, so use them here.
 */
export const LocationsServicesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Locations & Services</h2>
        <p className="text-gray-600">
          Create, edit and retire the sites and services customers can book.
        </p>
      </div>

      <Tabs defaultValue="locations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="locations">
          <LocationsTab />
        </TabsContent>
        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
