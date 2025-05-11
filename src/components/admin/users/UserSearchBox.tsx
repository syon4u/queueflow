
import React from 'react';
import { Input } from '@/components/ui/input';

interface UserSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserSearchBox = ({ value, onChange }: UserSearchBoxProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        placeholder="Search users by email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
