
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  Users,
  Wrench,
  Settings
} from 'lucide-react';

export const LocationsServicesTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('locations');

  // Mock data
  const locations = [
    { id: '1', name: 'Main Office', address: '123 Government Center', capacity: 50, current: 23, status: 'open' },
    { id: '2', name: 'West Branch', address: '456 West Ave', capacity: 30, current: 15, status: 'open' },
    { id: '3', name: 'East Branch', address: '789 East St', capacity: 25, current: 8, status: 'closed' },
  ];

  const services = [
    { id: '1', name: 'Driver License Renewal', duration: 15, category: 'Licensing', active: true },
    { id: '2', name: 'Vehicle Registration', duration: 20, category: 'Vehicle', active: true },
    { id: '3', name: 'Title Transfer', duration: 25, category: 'Vehicle', active: true },
    { id: '4', name: 'ID Card Application', duration: 10, category: 'Licensing', active: false },
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Locations & Services Setup</h2>
          <p className="text-sm text-gray-500">Manage service locations, service types, and operational settings</p>
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="locations">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Service Locations</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>

            <div className="grid gap-4">
              {locations.map((location) => (
                <Card key={location.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{location.name}</h4>
                          <Badge variant={location.status === 'open' ? 'default' : 'secondary'}>
                            {location.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{location.address}</p>
                        <div className="flex gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>Capacity: {location.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Current: {location.current}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Service Types</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{service.name}</h4>
                          <Badge variant={service.active ? 'default' : 'secondary'}>
                            {service.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Duration: {service.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
