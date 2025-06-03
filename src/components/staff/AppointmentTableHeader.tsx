
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

export const AppointmentTableHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <TableHeader>
      <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
        <TableHead className="font-semibold text-gray-700 py-4 px-6">
          {t('appointments.scheduledTime')}
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-4 px-6">
          {t('appointments.status')}
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-4 px-6">
          {t('appointments.service')}
        </TableHead>
        <TableHead className="hidden md:table-cell font-semibold text-gray-700 py-4 px-6">
          {t('appointments.customer')}
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">
          {t('common.actions')}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
