
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';

export interface Column<T extends object = Record<string, unknown>> {
  key: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  onAddClick?: () => void;
  onEditClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  isLoading?: boolean;
}

export const DataTable = <T extends object>({
  data,
  columns,
  onAddClick,
  onEditClick,
  onDeleteClick,
  isLoading = false
}: DataTableProps<T>) => {
  return (
    <div>
      {/* Header with add button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Data</h2>
        {onAddClick && (
          <Button onClick={onAddClick} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        )}
      </div>
      
      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
              {(onEditClick || onDeleteClick) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEditClick || onDeleteClick ? 1 : 0)} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEditClick || onDeleteClick ? 1 : 0)} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const rowId = (row as { id?: React.Key }).id;
                return (
                <TableRow key={rowId || index}>
                  {columns.map((column) => (
                    <TableCell key={`${rowId}-${column.key}`}>
                      {column.cell ? column.cell(row) : ((row as Record<string, unknown>)[column.key] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {(onEditClick || onDeleteClick) && (
                    <TableCell>
                      <div className="flex space-x-2">
                        {onEditClick && (
                          <Button variant="outline" size="sm" onClick={() => onEditClick(row)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteClick && (
                          <Button variant="outline" size="sm" onClick={() => onDeleteClick(row)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
