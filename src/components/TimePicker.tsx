
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface TimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string;
  onTimeChange: (time: string) => void;
}

const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const minuteOptions = ['00', '15', '30', '45'];
const amPmOptions = ['AM', 'PM'];

const TimePicker = ({ date, onDateChange, time, onTimeChange }: TimePickerProps) => {
  const [hour, minute, amPm] = time ? time.split(/[:\s]/) : ['', '', ''];

  const handleHourChange = (value: string) => {
    onTimeChange(`${value}:${minute || '00'} ${amPm || 'AM'}`);
  };

  const handleMinuteChange = (value: string) => {
    onTimeChange(`${hour || '9'}:${value} ${amPm || 'AM'}`);
  };

  const handleAmPmChange = (value: string) => {
    onTimeChange(`${hour || '9'}:${minute || '00'} ${value}`);
  };

  return (
    <div className="space-y-6">
      {/* Date Selection Card */}
      <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
        <CardContent className="p-4">
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              Preferred Date
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 pl-4 text-left font-normal text-base border-2 hover:border-blue-300 transition-colors",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? (
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-800">{format(date, "EEEE, MMMM do, yyyy")}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span>Select your preferred date</span>
                      </div>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={onDateChange}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        </CardContent>
      </Card>

      {/* Time Selection Card */}
      <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
        <CardContent className="p-4">
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Preferred Time
            </FormLabel>
            <div className="grid grid-cols-3 gap-3">
              {/* Hour Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Hour</label>
                <Select value={hour} onValueChange={handleHourChange}>
                  <SelectTrigger className="h-12 border-2 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        <span className="text-lg font-medium">{h}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Minute Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Minute</label>
                <Select value={minute} onValueChange={handleMinuteChange}>
                  <SelectTrigger className="h-12 border-2 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((m) => (
                      <SelectItem key={m} value={m}>
                        <span className="text-lg font-medium">{m}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* AM/PM Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Period</label>
                <Select value={amPm} onValueChange={handleAmPmChange}>
                  <SelectTrigger className="h-12 border-2 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    {amPmOptions.map((ap) => (
                      <SelectItem key={ap} value={ap}>
                        <span className="text-lg font-medium">{ap}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Selected Time Display */}
            {hour && minute && amPm && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Selected time: {hour}:{minute} {amPm}
                  </span>
                </div>
              </div>
            )}
          </FormItem>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimePicker;
