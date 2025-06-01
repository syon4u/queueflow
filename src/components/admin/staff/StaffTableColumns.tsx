
import { Column } from '../DataTable';

export const useStaffTableColumns = (): Column[] => {
  return [
    { 
      key: 'name', 
      header: 'Name',
      cell: (row) => `${row.first_name} ${row.last_name}`
    },
    { key: 'role', header: 'Role' },
    { 
      key: 'location_id', 
      header: 'Location',
      cell: (row) => row.locations?.name || 'Unassigned'
    },
    { key: 'phone', header: 'Phone' }
  ];
};
