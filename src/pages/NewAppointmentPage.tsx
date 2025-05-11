
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, addDays, addMinutes, startOfHour } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import LocationSelector from '@/components/LocationSelector';
import ServiceSelector from '@/components/ServiceSelector';
import TimePicker from '@/components/TimePicker';

interface Location {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  description: string | null;
}

const NewAppointmentPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Form state
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Data state
  const [locations, setLocations] = useState<Location[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setLocations(data || []);
        if (data && data.length > 0) {
          setSelectedLocationId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast({
          title: t('common.error'),
          description: t('appointments.errorFetchingLocations'),
          variant: 'destructive'
        });
      }
    };
    
    fetchLocations();
  }, [toast, t]);
  
  // Fetch services when location changes
  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedLocationId) return;
      
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, duration, description')
          .eq('location_id', selectedLocationId)
          .order('name');
          
        if (error) throw error;
        
        setServices(data || []);
        setSelectedServiceId(''); // Reset service when location changes
      } catch (error) {
        console.error('Error fetching services:', error);
        toast({
          title: t('common.error'),
          description: t('appointments.errorFetchingServices'),
          variant: 'destructive'
        });
      }
    };
    
    fetchServices();
  }, [selectedLocationId, toast, t]);
  
  // Generate available times when date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    // Generate time slots from 9 AM to 5 PM
    const times = [];
    let time = startOfHour(new Date(selectedDate));
    time.setHours(9); // Start at 9 AM
    
    while (time.getHours() < 17) { // Until 5 PM
      times.push(format(time, 'HH:mm'));
      time = addMinutes(time, 30); // 30-minute increments
    }
    
    setAvailableTimes(times);
  }, [selectedDate]);
  
  const handleSubmit = async () => {
    if (!user?.id || !selectedLocationId || !selectedServiceId || !selectedDate || !selectedTime) {
      toast({
        title: t('common.error'),
        description: t('appointments.missingFields'),
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledTime = new Date(selectedDate);
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // Create appointment
      const { error } = await supabase
        .from('appointments')
        .insert({
          customer_id: user.id,
          service_id: selectedServiceId,
          location_id: selectedLocationId,
          scheduled_time: scheduledTime.toISOString(),
          notes: notes || null,
          status: 'scheduled'
        });
        
      if (error) throw error;
      
      toast({
        title: t('appointments.success'),
        description: t('appointments.appointmentCreated')
      });
      
      // Navigate to appointments page
      navigate('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.errorCreating'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    if (currentStep === 1 && !selectedLocationId) {
      toast({
        title: t('common.error'),
        description: t('appointments.selectLocation'),
        variant: 'destructive'
      });
      return;
    }
    
    if (currentStep === 2 && !selectedServiceId) {
      toast({
        title: t('common.error'),
        description: t('appointments.selectService'),
        variant: 'destructive'
      });
      return;
    }
    
    if (currentStep === 3 && (!selectedDate || !selectedTime)) {
      toast({
        title: t('common.error'),
        description: t('appointments.selectDateTime'),
        variant: 'destructive'
      });
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t('appointments.newAppointment')}</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('appointments.steps.title')}</CardTitle>
          <CardDescription>{t('appointments.steps.description')}</CardDescription>
          
          <div className="mt-4">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div 
                    className={cn(
                      "rounded-full h-10 w-10 flex items-center justify-center border-2",
                      currentStep === step 
                        ? "border-primary bg-primary text-primary-foreground" 
                        : currentStep > step
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    {step}
                  </div>
                  
                  {step < 4 && (
                    <div 
                      className={cn(
                        "h-1 w-16", 
                        currentStep > step ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex justify-between mt-2 text-sm">
              <div>{t('appointments.steps.location')}</div>
              <div>{t('appointments.steps.service')}</div>
              <div>{t('appointments.steps.dateTime')}</div>
              <div>{t('appointments.steps.confirm')}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Select Location */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label>{t('appointments.selectLocation')}</Label>
              <LocationSelector 
                value={selectedLocationId}
                onChange={setSelectedLocationId}
              />
            </div>
          )}
          
          {/* Step 2: Select Service */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>{t('appointments.selectService')}</Label>
              <ServiceSelector 
                value={selectedServiceId}
                onChange={setSelectedServiceId}
                locationId={selectedLocationId}
              />
              
              {selectedServiceId && services.find(s => s.id === selectedServiceId)?.description && (
                <div className="mt-4 text-sm text-muted-foreground">
                  {services.find(s => s.id === selectedServiceId)?.description}
                </div>
              )}
              
              {selectedServiceId && (
                <div className="mt-4 text-sm">
                  <span className="font-medium">{t('appointments.duration')}: </span>
                  {services.find(s => s.id === selectedServiceId)?.duration} {t('appointments.minutes')}
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Select Date and Time */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{t('appointments.selectDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : t('appointments.pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {selectedDate && (
                <div className="space-y-2">
                  <Label>{t('appointments.selectTime')}</Label>
                  <TimePicker 
                    times={availableTimes}
                    value={selectedTime}
                    onChange={setSelectedTime}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Confirm Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('appointments.location')}</h3>
                  <p className="font-medium">{locations.find(l => l.id === selectedLocationId)?.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('appointments.service')}</h3>
                  <p className="font-medium">{services.find(s => s.id === selectedServiceId)?.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('appointments.date')}</h3>
                  <p className="font-medium">{selectedDate ? format(selectedDate, 'PPP') : ''}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('appointments.time')}</h3>
                  <p className="font-medium">{selectedTime}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('appointments.duration')}</h3>
                  <p className="font-medium">{services.find(s => s.id === selectedServiceId)?.duration} {t('appointments.minutes')}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">{t('appointments.notes')}</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('appointments.notesPlaceholder')}
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            {t('common.back')}
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link to="/appointments">{t('common.cancel')}</Link>
          </Button>
        )}
        
        {currentStep < 4 ? (
          <Button onClick={nextStep}>
            {t('common.next')} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t('common.submitting') : t('appointments.schedule')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewAppointmentPage;
