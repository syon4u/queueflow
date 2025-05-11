
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

type StaffStatus = 'available' | 'busy' | 'break' | 'offline';

interface StaffStatusSectionProps {
  onStatusChange: () => void;
}

const StaffStatusSection: React.FC<StaffStatusSectionProps> = ({ onStatusChange }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<StaffStatus>('available');
  
  const handleStatusChange = (newStatus: StaffStatus) => {
    setStatus(newStatus);
    onStatusChange();
  };
  
  const getStatusColor = (checkStatus: StaffStatus) => {
    switch (checkStatus) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'break':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-green-500';
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg font-semibold">{t('staff.yourStatus')}</h2>
            <div className="flex items-center mt-2">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(status)}`}></span>
              <span className="font-medium">{t(`staff.status.${status}`)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={status === 'available' ? 'default' : 'outline'} 
              onClick={() => handleStatusChange('available')}
              className={status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {t('staff.status.available')}
            </Button>
            <Button 
              variant={status === 'busy' ? 'default' : 'outline'} 
              onClick={() => handleStatusChange('busy')}
              className={status === 'busy' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}
            >
              {t('staff.status.busy')}
            </Button>
            <Button 
              variant={status === 'break' ? 'default' : 'outline'} 
              onClick={() => handleStatusChange('break')}
              className={status === 'break' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              {t('staff.status.break')}
            </Button>
            <Button 
              variant={status === 'offline' ? 'default' : 'outline'} 
              onClick={() => handleStatusChange('offline')}
              className={status === 'offline' ? 'bg-gray-500 hover:bg-gray-600' : ''}
            >
              {t('staff.status.offline')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffStatusSection;
