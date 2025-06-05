
import { Column } from '@/components/admin/DataTable';

export const useUserTableColumns = (userType: 'staff' | 'employee'): Column[] => {
  const baseColumns: Column[] = [
    { 
      key: 'name', 
      header: 'Name',
      cell: (row: any) => `${row.first_name} ${row.last_name}`
    },
    { 
      key: 'role', 
      header: 'Role',
      cell: (row: any) => row.user_roles?.role || row.role || 'staff'
    },
    { 
      key: 'location_id', 
      header: 'Location',
      cell: (row: any) => row.locations?.name || 'Unassigned'
    },
    { 
      key: 'phone', 
      header: 'Phone',
      cell: (row: any) => row.phone || '-'
    }
  ];

  if (userType === 'employee') {
    return [
      ...baseColumns,
      { 
        key: 'status', 
        header: 'Status',
        cell: (row: any) => row.status || 'inactive'
      },
      { 
        key: 'email', 
        header: 'Email',
        cell: (row: any) => row.email || '-'
      }
    ];
  }

  return baseColumns;
};
