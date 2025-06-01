
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

export const AppointmentTableHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <TableHeader>
      <TableRow>
        <TableHead>{t('appointments.scheduledTime')}</TableHead>
        <TableHead>{t('appointments.status')}</TableHead>
        <TableHead>{t('appointments.service')}</TableHead>
        <TableHead className="hidden md:table-cell">{t('appointments.customer')}</TableHead>
        <TableHead>{t('common.actions')}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
