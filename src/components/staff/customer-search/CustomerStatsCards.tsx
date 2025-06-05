
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  appointmentCount: number;
  lastAppointment: string | null;
  mostRecentStatus: string;
  locations: string[];
  services: string[];
}

interface CustomerStatsCardsProps {
  customers: Customer[];
  filteredCustomers: Customer[];
}

export const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({
  customers,
  filteredCustomers
}) => {
  const totalAppointments = customers.reduce((sum, customer) => sum + customer.appointmentCount, 0);
  const avgAppointmentsPerCustomer = customers.length > 0 ? Math.round(totalAppointments / customers.length) : 0;
  const recentCustomers = customers.filter(customer => {
    if (!customer.lastAppointment) return false;
    const lastVisit = new Date(customer.lastAppointment);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastVisit >= thirtyDaysAgo;
  }).length;

  const statItems = [
    {
      label: 'Total Customers',
      value: customers.length,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Total Appointments',
      value: totalAppointments,
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: 'Recent Visitors',
      value: recentCustomers,
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Avg Appointments',
      value: avgAppointmentsPerCustomer,
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card 
          key={index} 
          className={`border-l-4 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] ${item.borderColor} ${item.bgColor}`}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
              <p className={`text-2xl font-semibold ${item.color}`}>
                {item.value}
              </p>
            </div>
            <div className="bg-white rounded-full p-3 shadow-sm">{item.icon}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
