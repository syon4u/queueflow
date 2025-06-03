
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  appointment_count?: number;
  last_appointment?: string;
  most_used_location?: string;
  most_used_service?: string;
}

interface CustomerTableProps {
  customers: Customer[];
  filteredCustomers: Customer[];
  searchTerm: string;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  filteredCustomers,
  searchTerm
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Directory</CardTitle>
        <CardDescription>
          Showing {filteredCustomers.length} of {customers.length} customers with detailed appointment history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">No customers found in the database</p>
            <p className="text-sm text-muted-foreground mt-2">
              Customers will appear here once they create appointments through the system
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Customer Name</TableHead>
                  <TableHead className="min-w-[200px]">Contact Information</TableHead>
                  <TableHead className="min-w-[150px]">Preferences</TableHead>
                  <TableHead className="min-w-[120px]">Activity</TableHead>
                  <TableHead className="min-w-[100px]">Last Visit</TableHead>
                  <TableHead className="min-w-[100px]">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-base">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {customer.id.slice(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-blue-500" />
                            <span className="truncate max-w-[180px]">{customer.email}</span>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-green-500" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        {!customer.email && !customer.phone && (
                          <span className="text-xs text-muted-foreground italic">
                            No contact info
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {customer.most_used_location && (
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3 text-orange-500" />
                            <span className="truncate max-w-[120px]" title={customer.most_used_location}>
                              {customer.most_used_location}
                            </span>
                          </div>
                        )}
                        {customer.most_used_service && (
                          <div className="flex items-center gap-1 text-xs">
                            <Briefcase className="h-3 w-3 text-purple-500" />
                            <span className="truncate max-w-[120px]" title={customer.most_used_service}>
                              {customer.most_used_service}
                            </span>
                          </div>
                        )}
                        {!customer.most_used_location && !customer.most_used_service && (
                          <span className="text-xs text-muted-foreground italic">
                            No preferences
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge 
                          variant={customer.appointment_count && customer.appointment_count > 0 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {customer.appointment_count || 0} appointments
                        </Badge>
                        {customer.appointment_count && customer.appointment_count > 5 && (
                          <Badge variant="outline" className="text-xs">
                            Frequent customer
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.last_appointment ? (
                        <span className="text-sm font-medium">
                          {formatDate(customer.last_appointment)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          Never visited
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(customer.created_at)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCustomers.length === 0 && customers.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Mail className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p className="font-medium">No customers found</p>
                        <p className="text-sm">
                          No customers match your search for "{searchTerm}"
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
