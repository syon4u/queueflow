
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable, type Column } from '../DataTable';
import { StaffFormDialog, type StaffFormData } from '../staff/StaffFormDialog';
import type { Profile } from '@/hooks/admin/use-profile-management';

interface StaffManagementSectionProps {
  staffMembers: Profile[] | undefined;
  staffColumns: Column<Profile>[];
  staffLoading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  formData: StaffFormData;
  setFormData: (data: StaffFormData) => void;
  isEditing: boolean;
  locations: Array<{ id: string; name: string }> | null | undefined;
  handleAddClick: () => void;
  handleEditClick: (staff: Profile) => void;
  handleDeleteClick: (staff: Profile) => void;
  handleSubmit: () => void;
}

export const StaffManagementSection: React.FC<StaffManagementSectionProps> = ({
  staffMembers,
  staffColumns,
  staffLoading,
  isDialogOpen,
  setIsDialogOpen,
  formData,
  setFormData,
  isEditing,
  locations,
  handleAddClick,
  handleEditClick,
  handleDeleteClick,
  handleSubmit
}) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Staff Members & Role Assignments</h2>
        </div>
        <Button onClick={handleAddClick} className="bg-slate-900 hover:bg-slate-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
      
      <DataTable
        data={staffMembers || []}
        columns={staffColumns}
        isLoading={staffLoading}
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
