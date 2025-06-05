
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Clock, Users, Settings, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  max_capacity: number;
  current_capacity: number;
  queue_status: string;
  operating_hours: any;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  location_id: string;
  is_active: boolean;
  max_appointments_per_slot: number;
}

export const LocationsServicesTab: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'locations' | 'services'>('locations');

  const { data: locations = [], isLoading: locationsLoading, refetch: refetchLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Location[];
    }
  });

  const { data: services = [], isLoading: servicesLoading, refetch: refetchServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Service[];
    }
  });

  const filteredLocations = locations.filter(location => {
    const matchesSearch = searchTerm === '' || 
      location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || location.queue_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm === '' || 
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && service.is_active) ||
      (statusFilter === 'inactive' && !service.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateLocation = () => {
    toast({
      title: "Create Location",
      description: "Location creation form would open here",
    });
  };

  const handleEditLocation = (locationId: string) => {
    setSelectedLocation(locationId);
    toast({
      title: "Edit Location",
      description: "Location edit form would open here",
    });
  };

  const handleDeleteLocation = (locationId: string) => {
    toast({
      title: "Delete Location",
      description: "Location deletion confirmation would appear here",
      variant: "destructive",
    });
  };

  const handleCreateService = () => {
    toast({
      title: "Create Service",
      description: "Service creation form would open here",
    });
  };

  const handleEditService = (serviceId: string) => {
    toast({
      title: "Edit Service",
      description: "Service edit form would open here",
    });
  };

  const handleToggleService = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Service ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
      
      refetchServices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCapacity = async (locationId: string, newCapacity: number) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ max_capacity: newCapacity })
        .eq('id', locationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Location capacity updated",
      });
      
      refetchLocations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update capacity",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-50 text-green-700 border-green-200';
      case 'closed': return 'bg-red-50 text-red-700 border-red-200';
      case 'maintenance': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const locationStats = {
    total: locations.length,
    open: locations.filter(l => l.queue_status === 'open').length,
    closed: locations.filter(l => l.queue_status === 'closed').length,
    maintenance: locations.filter(l => l.queue_status === 'maintenance').length,
  };

  const serviceStats = {
    total: services.length,
    active: services.filter(s => s.is_active).length,
    inactive: services.filter(s => !s.is_active).length,
    locations: new Set(services.map(s => s.location_id)).size,
  };

  if (locationsLoading || servicesLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Locations & Services</h2>
          <p className="text-gray-600">Manage service locations, configurations, and available services</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'locations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('locations')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Locations
          </Button>
          <Button 
            variant={activeTab === 'services' ? 'default' : 'outline'}
            onClick={() => setActiveTab('services')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Services
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeTab === 'locations' ? (
          <>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Total Locations</p>
                    <p className="text-3xl font-bold text-blue-900">{locationStats.total}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">Open</p>
                    <p className="text-3xl font-bold text-green-900">{locationStats.open}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">Closed</p>
                    <p className="text-3xl font-bold text-red-900">{locationStats.closed}</p>
                  </div>
                  <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700 mb-1">Maintenance</p>
                    <p className="text-3xl font-bold text-yellow-900">{locationStats.maintenance}</p>
                  </div>
                  <Settings className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 mb-1">Total Services</p>
                    <p className="text-3xl font-bold text-purple-900">{serviceStats.total}</p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">Active</p>
                    <p className="text-3xl font-bold text-green-900">{serviceStats.active}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Inactive</p>
                    <p className="text-3xl font-bold text-gray-900">{serviceStats.inactive}</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Locations</p>
                    <p className="text-3xl font-bold text-blue-900">{serviceStats.locations}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {activeTab === 'locations' ? 'Location Management' : 'Service Management'}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                {activeTab === 'locations' ? filteredLocations.length : filteredServices.length} items
              </Badge>
              <Button 
                onClick={activeTab === 'locations' ? handleCreateLocation : handleCreateService}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create {activeTab === 'locations' ? 'Location' : 'Service'}
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {activeTab === 'locations' ? (
                  <>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {activeTab === 'locations' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Location</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Capacity</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Contact</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocations.map((location) => (
                    <tr 
                      key={location.id} 
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        selectedLocation === location.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedLocation(location.id)}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{location.name}</p>
                          <p className="text-sm text-gray-500">{location.address}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusBadgeColor(location.queue_status)} border-0`}
                        >
                          {location.queue_status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {location.current_capacity}/{location.max_capacity}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-500">
                          <p>{location.phone}</p>
                          <p>{location.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLocation(location.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLocation(location.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Service</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Duration</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Location</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr 
                      key={service.id} 
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{service.duration} min</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {locations.find(l => l.id === service.location_id)?.name || 'Unknown'}
                      </td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant="outline" 
                          className={service.is_active 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditService(service.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleService(service.id, service.is_active)}
                            className={service.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          >
                            {service.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
