
export interface CreateUserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

export interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}
