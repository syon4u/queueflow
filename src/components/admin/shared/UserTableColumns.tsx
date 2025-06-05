
import { Column } from '../DataTable';

interface UserTableColumnsOptions {
  userType?: 'staff' | 'employee';
  showLocation?: boolean;
  showStatus?: boolean;
  showEmail?: boolean;
}

export const useUserTableColumns = (options: UserTableColumnsOptions = {}): Column[] => {
  const { 
    userType = 'staff', 
    showLocation = false, 
    showStatus = false, 
    showEmail = false 
  } = options;

  const baseColumns: Column[] = [
    { 
      key: 'name', 
      header: 'Name',
      cell: (row) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'N/A'
    },
    { 
      key: 'role', 
      header: 'Role',
      cell: (row) => row.role || 'customer'
    }
  ];

  // Add location column if requested
  if (showLocation) {
    baseColumns.push({
      key: 'location_id', 
      header: 'Location',
      cell: (row) => row.locations?.name || 'Unassigned'
    });
  }

  // Add status column if requested
  if (showStatus) {
    baseColumns.push({
      key: 'status', 
      header: 'Status',
      cell: (row) => row.status || 'inactive'
    });
  }

  // Add phone column (always included)
  baseColumns.push({ key: 'phone', header: 'Phone' });

  // Add email column if requested
  if (showEmail) {
    baseColumns.push({ key: 'email', header: 'Email' });
  }

  return baseColumns;
};
