
import React from 'react';
import CustomerSearchBox, { Customer } from '../CustomerSearchBox';

interface CustomerSearchStepProps {
  onSelectCustomer: (customer: Customer) => void;
  onCreateNew: () => void;
}

const CustomerSearchStep = ({ onSelectCustomer, onCreateNew }: CustomerSearchStepProps) => {
  return (
    <CustomerSearchBox 
      onSelectCustomer={onSelectCustomer} 
      onCreateNew={onCreateNew} 
    />
  );
};

export default CustomerSearchStep;
