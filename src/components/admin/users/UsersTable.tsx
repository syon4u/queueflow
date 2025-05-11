
import React from 'react';
import { User } from 'lucide-react';
import { UserData } from '@/hooks/admin/use-user-management';
import { UserRoleSelector } from './UserRoleSelector';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UsersTableProps {
  users: UserData[];
  onRoleChange: (userId: string, role: string) => void;
}

export const UsersTable = ({ users, onRoleChange }: UsersTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>Change Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <User className="h-5 w-5 text-muted-foreground" />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.role || 'customer'}
                  </span>
                </TableCell>
                <TableCell>
                  <UserRoleSelector 
                    currentRole={user.role || 'customer'}
                    userId={user.id}
                    onRoleChange={onRoleChange}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
