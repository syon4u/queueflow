
import React from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { UserFormDialog } from './UserFormDialog';
import { useUserManagement } from '@/hooks/shared/use-user-management';
import { useUserTableColumns } from './UserTableColumns';
import Breadcrumb from '@/components/navigation/Breadcrumb';

interface UserManagementTabProps {
  userType: 'staff' | 'employee';
  title: string;
  breadcrumbLabel: string;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({ 
  userType, 
  title, 
  breadcrumbLabel 
}) => {
  const {
    users,
    locations,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    formData,
    setFormData,
    isEditing,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit
  } = useUserManagement(userType);

  const columns = useUserTableColumns(userType);

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: 'Admin Dashboard', href: '/admin' },
            { label: breadcrumbLabel, isActive: true }
          ]}
          className="mb-4"
        />
      </div>

      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      <DataTable
        data={users || []}
        columns={columns}
        isLoading={isLoading}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        locations={locations || []}
        userType={userType}
      />
    </div>
  );
};
