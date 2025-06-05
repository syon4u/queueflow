
import { Column } from '../DataTable';

export const useEmployeeTableColumns = (): Column[] => {
  return [
    { 
      key: 'name', 
      header: 'Name',
      cell: (row) => `${row.first_name} ${row.last_name}`
    },
    { 
      key: 'role', 
      header: 'Role',
      cell: (row) => row.role || 'staff'
    },
    { 
      key: 'location_id', 
      header: 'Location',
      cell: (row) => row.locations?.name || 'Unassigned'
    },
    { 
      key: 'status', 
      header: 'Status',
      cell: (row) => row.status || 'inactive'
    },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' }
  ];
};
