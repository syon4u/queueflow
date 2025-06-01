
import React, { useState } from 'react';
import { TemplateFilters } from './TemplateFilters';
import { TemplatesList } from './TemplatesList';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Communication Templates</h2>
        <p className="text-muted-foreground">
          Manage email and SMS templates for customer communications
        </p>
      </div>

      <TemplateFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      <TemplatesList
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
      />
    </div>
  );
};
