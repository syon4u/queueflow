
import React from 'react';
import { UserCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import { StaffFormDialog } from '../staff/StaffFormDialog';
import { useUserTableColumns } from '@/components/shared/UserTableColumns';

interface StaffManagementSectionProps {
  staffMembers: any[];
  locations: any[];
  isLoading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  isEditing: boolean;
  handleAddClick: () => void;
  handleEditClick: (staff: any) => void;
  handleDeleteClick: (staff: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const StaffManagementSection: React.FC<StaffManagementSectionProps> = ({
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
}) => {
  const staffColumns = useUserTableColumns('staff');

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Staff Members</h2>
          <p className="text-sm text-gray-500">Manage staff profiles, roles, and location assignments</p>
        </div>
        <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
      
      <DataTable
        data={staffMembers || []}
        columns={staffColumns}
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
