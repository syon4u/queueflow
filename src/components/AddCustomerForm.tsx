
import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { useAppData } from '@/hooks/useAppData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AddCustomerForm: React.FC = () => {
  const { addCustomer } = useQueue();
  const { services, isLoading } = useAppData();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [service, setService] = React.useState('');
  const [priority, setPriority] = React.useState<'normal' | 'priority'>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Customer name is required');
      return;
    }
    
    if (!service) {
      toast.error('Service selection is required');
      return;
    }
    
    addCustomer({
      name: name.trim(),
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      service,
      priority,
      estimatedWaitTime: 5, // Default estimate
    });
    
    // Reset form
    setName('');
    setPhone('');
    setNotes('');
    setService('');
    setPriority('normal');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Add Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">Service <span className="text-red-500">*</span></Label>
            <Select value={service} onValueChange={setService} required disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading services..." : "Select a service"} />
              </SelectTrigger>
              <SelectContent>
                {services && services.length > 0 ? (
                  services.map((serviceItem) => (
                    <SelectItem key={serviceItem.id} value={serviceItem.name}>
                      {serviceItem.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__none" disabled>
                    No services available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special requirements or additional information"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <RadioGroup
              value={priority}
              onValueChange={(value) => setPriority(value as 'normal' | 'priority')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="font-normal cursor-pointer">Regular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="priority" id="priority" />
                <Label htmlFor="priority" className="font-normal cursor-pointer">Priority</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full bg-qflow-teal hover:bg-qflow-darkTeal">
            Add to Queue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCustomerForm;
