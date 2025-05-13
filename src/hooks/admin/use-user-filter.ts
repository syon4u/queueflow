
import { useState, useMemo } from 'react';
import { UserData } from './types/user-management.types';

export const useUserFilter = (users: UserData[] = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return users?.filter(user => {
      const searchContent = [
        user.email?.toLowerCase(),
        user.first_name?.toLowerCase(),
        user.last_name?.toLowerCase(),
        user.role?.toLowerCase()
      ].join(' ');
      
      return searchContent.includes(searchQuery.toLowerCase());
    }) || [];
  }, [users, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredUsers
  };
};
