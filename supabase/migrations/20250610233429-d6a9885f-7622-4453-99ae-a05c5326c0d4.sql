
-- Create the customer_location_services table
CREATE TABLE public.customer_location_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  custom_location_name TEXT,
  custom_location_address TEXT,
  custom_service_name TEXT,
  custom_service_description TEXT,
  custom_service_duration INTEGER DEFAULT 30,
  is_custom_location BOOLEAN DEFAULT FALSE,
  is_custom_service BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_customer_location_services_customer_id ON public.customer_location_services(customer_id);
CREATE INDEX idx_customer_location_services_location_id ON public.customer_location_services(location_id);
CREATE INDEX idx_customer_location_services_service_id ON public.customer_location_services(service_id);

-- Add trigger for updated_at
CREATE TRIGGER trigger_customer_location_services_updated_at
  BEFORE UPDATE ON public.customer_location_services
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

-- Enable RLS and create read-only policies for customers
ALTER TABLE public.customer_location_services ENABLE ROW LEVEL SECURITY;

-- Create read-only policy for everyone (including anonymous users)
CREATE POLICY "Everyone can view customer location services" 
  ON public.customer_location_services 
  FOR SELECT 
  USING (true);

-- Create restrictive policies for write operations (only allow authenticated staff/admin)
CREATE POLICY "Only staff can create customer location services" 
  ON public.customer_location_services 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('staff', 'admin', 'power_user')
    )
  );

CREATE POLICY "Only staff can update customer location services" 
  ON public.customer_location_services 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('staff', 'admin', 'power_user')
    )
  );

CREATE POLICY "Only staff can delete customer location services" 
  ON public.customer_location_services 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('staff', 'admin', 'power_user')
    )
  );
