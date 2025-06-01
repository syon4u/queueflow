
export const mapStatusToUnionType = (status: string | null): 'available' | 'busy' | 'break' | 'offline' => {
  switch (status) {
    case 'available':
    case 'active':
      return 'available';
    case 'busy':
      return 'busy';
    case 'break':
      return 'break';
    case 'offline':
    case 'inactive':
      return 'offline';
    default:
      return 'offline';
  }
};
