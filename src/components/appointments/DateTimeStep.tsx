
import React from 'react';
import { useTranslation } from 'react-i18next';
import TimePicker from '@/components/TimePicker';

interface DateTimeStepProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string;
  onTimeChange: (time: string) => void;
}

const DateTimeStep: React.FC<DateTimeStepProps> = ({ date, onDateChange, time, onTimeChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <TimePicker 
        date={date}
        onDateChange={onDateChange}
        time={time}
        onTimeChange={onTimeChange}
      />
    </div>
  );
};

export default DateTimeStep;
