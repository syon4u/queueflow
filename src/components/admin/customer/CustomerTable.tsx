
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail } from 'lucide-react';
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
        <CardTitle>Customer List</CardTitle>
        <CardDescription>
          Showing {filteredCustomers.length} of {customers.length} customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">No customers found in the database.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Customers will appear here once they create appointments.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Appointments</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.appointment_count > 0 ? "default" : "secondary"}>
                      {customer.appointment_count || 0} appointments
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.last_appointment ? (
                      <span className="text-sm">
                        {formatDate(customer.last_appointment)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No appointments
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
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No customers found matching your search "{searchTerm}".
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
