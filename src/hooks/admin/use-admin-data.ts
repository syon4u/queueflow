import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';

// Mock data for daily queue statistics
const mockDailyStats = (days = 7) => {
  const result = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    result.push({
      date: format(date, 'yyyy-MM-dd'),
      customers_served: Math.floor(Math.random() * 50) + 20,
      average_wait_time: Math.floor(Math.random() * 20) + 5,
      no_shows: Math.floor(Math.random() * 5),
      total_waiting: Math.floor(Math.random() * 10) + 2
    });
  }
  
  return result;
};

// Mock data for queue statistics
const mockQueueStats = () => {
  const services = ['License Renewal', 'ID Card', 'Vehicle Registration', 'Property Tax'];
  const locations = ['Main Office', 'North Branch', 'South Branch'];
  
  const result = [];
  
  for (const service of services) {
    for (const location of locations) {
      result.push({
        service_id: `service-${services.indexOf(service) + 1}`,
        service_name: service,
        location_id: `location-${locations.indexOf(location) + 1}`,
        location_name: location,
        customers_served: Math.floor(Math.random() * 100) + 50,
        average_wait_time: Math.floor(Math.random() * 30) + 5,
        total_waiting: Math.floor(Math.random() * 15)
      });
    }
  }
  
  return result;
};

// Mock data for locations
const mockLocations = () => {
  return [
    { id: 'location-1', name: 'Main Office', address: '123 Main St', phone: '555-123-4567', email: 'main@example.com' },
    { id: 'location-2', name: 'North Branch', address: '456 North Ave', phone: '555-234-5678', email: 'north@example.com' },
    { id: 'location-3', name: 'South Branch', address: '789 South Blvd', phone: '555-345-6789', email: 'south@example.com' }
  ];
};

// Mock data for services
const mockServices = () => {
  return [
    { id: 'service-1', name: 'License Renewal', description: 'Renew your driver\'s license', duration: 15, location_id: 'location-1' },
    { id: 'service-2', name: 'ID Card', description: 'Get a new ID card', duration: 10, location_id: 'location-1' },
    { id: 'service-3', name: 'Vehicle Registration', description: 'Register your vehicle', duration: 20, location_id: 'location-2' },
    { id: 'service-4', name: 'Property Tax', description: 'Pay property taxes', duration: 15, location_id: 'location-3' }
  ];
};

// Fetch daily queue statistics for a given time range
export const useDailyQueueStats = (days = 7) => {
  return useQuery({
    queryKey: ['daily-queue-stats', days],
    queryFn: async () => {
      // Return mock data for demo
      return mockDailyStats(days);
    }
  });
};

// Fetch general queue statistics
export const useQueueStats = () => {
  return useQuery({
    queryKey: ['queue-stats'],
    queryFn: async () => {
      // Return mock data for demo
      return mockQueueStats();
    }
  });
};

// Fetch all locations
export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      // Return mock data for demo
      return mockLocations();
    }
  });
};

// Fetch all services
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      // Return mock data for demo
      return mockServices();
    }
  });
};