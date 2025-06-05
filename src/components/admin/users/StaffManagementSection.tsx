
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '../DataTable';
import { StaffFormDialog } from '../staff/StaffFormDialog';

interface StaffManagementSectionProps {
  staffMembers: any[];
  staffColumns: any[];
  staffLoading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  isEditing: boolean;
  locations: any[];
  handleAddClick: () => void;
  handleEditClick: (staff: any) => void;
  handleDeleteClick: (staff: any) => void;
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
          <h2 className="text-lg font-semibold text-gray-900">Staff Members & Role Assignments</h2>
          <p className="text-sm text-gray-500">Manage staff profiles, role assignments, and location access permissions</p>
        </div>
        <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
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
