
import { Column } from '../DataTable';
import type { Profile } from '@/hooks/admin/use-profile-management';

export const useStaffTableColumns = (): Column<Profile>[] => {
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
