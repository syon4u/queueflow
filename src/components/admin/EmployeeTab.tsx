
import React from 'react';
import { DataTable } from './DataTable';
import { EmployeeFormDialog } from './employee/EmployeeFormDialog';
import { useEmployeeManagement } from '@/hooks/admin/use-employee-management';
import { useUserTableColumns } from './shared/UserTableColumns';
import Breadcrumb from '@/components/navigation/Breadcrumb';

export const EmployeeTab: React.FC = () => {
  const {
    staffMembers,
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
  } = useEmployeeManagement();

  const columns = useUserTableColumns({ 
    userType: 'employee',
    showLocation: true,
    showStatus: true,
    showEmail: true
  });

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: 'Admin Dashboard', href: '/admin' },
            { label: 'Employee Management', isActive: true }
          ]}
          className="mb-4"
        />
      </div>

      <h1 className="text-2xl font-bold mb-6">Employees</h1>
      
      <DataTable
        data={staffMembers || []}
        columns={columns}
        isLoading={isLoading}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <EmployeeFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        locations={locations || []}
      />
    </div>
  );
};
