
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Edit, Trash2, Calendar, Clock, User, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export const AppointmentOverridesTab: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOverride, setSelectedOverride] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Mock data for overrides
  const overrides = [
    {
      id: '1',
      type: 'Emergency Appointment',
      customer: 'John Doe',
      originalTime: '2024-01-15 10:00 AM',
      newTime: '2024-01-15 9:00 AM',
      reason: 'Urgent medical documentation needed',
      status: 'active',
      createdBy: 'Admin User',
      createdAt: '2024-01-14 3:30 PM',
    },
    {
      id: '2',
      type: 'Priority Scheduling',
      customer: 'Jane Smith',
      originalTime: 'Not scheduled',
      newTime: '2024-01-16 2:00 PM',
      reason: 'VIP customer - special handling required',
      status: 'pending',
      createdBy: 'Manager',
      createdAt: '2024-01-15 1:15 PM',
    },
    {
      id: '3',
      type: 'Time Extension',
      customer: 'Bob Johnson',
      originalTime: '30 minutes',
      newTime: '60 minutes',
      reason: 'Complex case requiring additional time',
      status: 'active',
      createdBy: 'Staff Member',
      createdAt: '2024-01-15 11:45 AM',
    },
    {
      id: '4',
      type: 'Capacity Override',
      customer: 'Walk-in Customer',
      originalTime: 'No slots available',
      newTime: '2024-01-17 4:30 PM',
      reason: 'Emergency situation - exceed normal capacity',
      status: 'expired',
      createdBy: 'Supervisor',
      createdAt: '2024-01-12 2:20 PM',
    },
  ];

  const filteredOverrides = overrides.filter(override => {
    const matchesSearch = searchTerm === '' || 
      override.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      override.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      override.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || override.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateOverride = () => {
    setShowCreateDialog(true);
  };

  const handleEditOverride = (overrideId: string) => {
    setSelectedOverride(overrideId);
    toast({
      title: "Edit Override",
      description: "Override edit form would open here",
    });
  };

  const handleDeleteOverride = (overrideId: string) => {
    toast({
      title: "Delete Override",
      description: "Override deletion confirmation would appear here",
      variant: "destructive",
    });
  };

  const handleApproveOverride = (overrideId: string) => {
    toast({
      title: "Override Approved",
      description: "The appointment override has been approved and activated",
    });
  };

  const handleRejectOverride = (overrideId: string) => {
    toast({
      title: "Override Rejected",
      description: "The appointment override has been rejected",
      variant: "destructive",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency Appointment': return 'bg-red-50 text-red-700 border-red-200';
      case 'Priority Scheduling': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Time Extension': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Capacity Override': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: overrides.length,
    active: overrides.filter(o => o.status === 'active').length,
    pending: overrides.filter(o => o.status === 'pending').length,
    expired: overrides.filter(o => o.status === 'expired').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Overrides</h2>
          <p className="text-gray-600">Manage special scheduling rules and exceptions for appointments</p>
        </div>
        <Button onClick={handleCreateOverride} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Override
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Overrides</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-900">{stats.active}</p>
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Expired</p>
                <p className="text-3xl font-bold text-red-900">{stats.expired}</p>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Override Management */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Override Management</CardTitle>
            <Badge variant="outline">{filteredOverrides.length} overrides</Badge>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search overrides..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredOverrides.length === 0 ? (
            <div className="text-center py-12 px-6">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No overrides found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first appointment override to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={handleCreateOverride} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Override
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {filteredOverrides.map((override) => (
                <Card key={override.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge 
                            variant="outline" 
                            className={`${getTypeColor(override.type)} border-0`}
                          >
                            {override.type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(override.status)} border-0`}
                          >
                            {override.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{override.customer}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                From: {override.originalTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                To: {override.newTime}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Reason:</strong> {override.reason}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created by {override.createdBy} on {override.createdAt}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {override.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveOverride(override.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectOverride(override.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditOverride(override.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteOverride(override.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Override Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Appointment Override</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Input id="customer" placeholder="Enter customer name" />
              </div>
              <div>
                <Label htmlFor="type">Override Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency Appointment</SelectItem>
                    <SelectItem value="priority">Priority Scheduling</SelectItem>
                    <SelectItem value="extension">Time Extension</SelectItem>
                    <SelectItem value="capacity">Capacity Override</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalTime">Original Time/Setting</Label>
                <Input id="originalTime" placeholder="Original appointment time" />
              </div>
              <div>
                <Label htmlFor="newTime">New Time/Setting</Label>
                <Input id="newTime" placeholder="New appointment time" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Reason for Override</Label>
              <Textarea 
                id="reason" 
                placeholder="Explain why this override is necessary..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Override Created",
                  description: "Appointment override has been created successfully",
                });
                setShowCreateDialog(false);
              }}>
                Create Override
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
