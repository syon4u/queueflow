
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RememberMeCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled = false
}) => {
  const handleChange = (checkedValue: boolean) => {
    onCheckedChange(checkedValue);
    // Store in localStorage for session manager
    localStorage.setItem('rememberMe', checkedValue.toString());
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember-me"
        checked={checked}
        onCheckedChange={handleChange}
        disabled={disabled}
      />
      <Label 
        htmlFor="remember-me" 
        className="text-sm text-muted-foreground cursor-pointer"
      >
        Remember me for 30 days
      </Label>
    </div>
  );
};
