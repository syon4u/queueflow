
import React from 'react';
import { DataTable } from './DataTable';
import { StaffFormDialog } from './staff/StaffFormDialog';
import { useProfileManagement } from '@/hooks/admin/use-profile-management';
import { useStaffTableColumns } from './staff/StaffTableColumns';
import Breadcrumb from '@/components/navigation/Breadcrumb';

export const StaffTab: React.FC = () => {
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
  } = useProfileManagement();

  const columns = useStaffTableColumns();

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: 'Admin Dashboard', href: '/admin' },
            { label: 'Staff Management', isActive: true }
          ]}
          className="mb-4"
        />
      </div>

      <h1 className="text-2xl font-bold mb-6">Staff Members</h1>
      
      <DataTable
        data={staffMembers || []}
        columns={columns}
        isLoading={isLoading}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <StaffFormDialog
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
