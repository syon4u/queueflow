
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

export const AppointmentTableHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <TableHeader>
      <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 border-b-2 border-blue-200 transition-all duration-200">
        <TableHead className="font-semibold text-gray-800 py-4 px-6 hover:text-blue-700 transition-colors cursor-pointer select-none relative">
          <div className="flex items-center space-x-2">
            <span>{t('appointments.scheduledTime')}</span>
          </div>
        </TableHead>
        <TableHead className="font-semibold text-gray-800 py-4 px-6 hover:text-blue-700 transition-colors cursor-pointer select-none relative">
          <div className="flex items-center space-x-2">
            <span>{t('appointments.status')}</span>
          </div>
        </TableHead>
        <TableHead className="font-semibold text-gray-800 py-4 px-6 hover:text-blue-700 transition-colors cursor-pointer select-none relative">
          <div className="flex items-center space-x-2">
            <span>{t('appointments.service')}</span>
          </div>
        </TableHead>
        <TableHead className="hidden md:table-cell font-semibold text-gray-800 py-4 px-6 hover:text-blue-700 transition-colors cursor-pointer select-none relative">
          <div className="flex items-center space-x-2">
            <span>{t('appointments.customer')}</span>
          </div>
        </TableHead>
        <TableHead className="font-semibold text-gray-800 py-4 px-6 text-center hover:text-blue-700 transition-colors cursor-pointer select-none relative">
          <div className="flex items-center justify-center space-x-2">
            <span>{t('common.actions')}</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
