
import React from 'react';
import AdminPageComponent from '@/components/admin/AdminPage';
import { QueueProvider } from '@/context/QueueContext';

const AdminPage = () => {
  return (
    <QueueProvider>
      <AdminPageComponent />
    </QueueProvider>
  );
};

export default AdminPage;
