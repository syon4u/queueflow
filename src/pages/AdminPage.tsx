
import React from 'react';
import AdminPageComponent from '@/components/admin/AdminPage';
import { useAppData } from '@/hooks/useAppData';

const AdminPage = () => {
  const { isLoading } = useAppData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <AdminPageComponent />;
};

export default AdminPage;
