
export const useTimeParser = () => {
  const parseTimeAndDate = (selectedDate: Date, selectedTime: string) => {
    const [hours, minutes] = selectedTime.split(':');
    const [minutesValue, ampm] = minutes.split(' ');
    let hour = parseInt(hours);
    
    if (ampm === 'PM' && hour < 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }

    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hour, parseInt(minutesValue));
    return scheduledDate;
  };

  return { parseTimeAndDate };
};
