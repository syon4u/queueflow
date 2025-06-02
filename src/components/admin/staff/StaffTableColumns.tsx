
import { Column } from '../DataTable';

export const useStaffTableColumns = (): Column[] => {
  return [
    { 
      key: 'name', 
      header: 'Name',
      cell: (row) => `${row.first_name} ${row.last_name}`
    },
    { 
      key: 'role', 
      header: 'Role',
      cell: (row) => row.user_roles?.role || 'staff'
    },
    { 
      key: 'location_id', 
      header: 'Location',
      cell: (row) => row.locations?.name || 'Unassigned'
    },
    { key: 'phone', header: 'Phone' }
  ];
};
