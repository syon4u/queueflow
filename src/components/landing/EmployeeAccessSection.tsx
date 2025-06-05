
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Shield, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmployeeAccessSectionProps {
  showStaffAccess: boolean;
  onToggleStaffAccess: () => void;
}

const EmployeeAccessSection: React.FC<EmployeeAccessSectionProps> = ({ 
  showStaffAccess, 
  onToggleStaffAccess 
}) => {
  if (!showStaffAccess) return null;

  return (
    <section className="py-12 bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Employee Access</h3>
            <p className="text-sm text-gray-600">Restricted access portals for authorized personnel</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleStaffAccess}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <UserCheck className="h-5 w-5" />
                Staff Portal
              </CardTitle>
              <CardDescription className="text-orange-700">
                Manage appointments and serve customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100" asChild>
                <Link to="/staff">Staff Login</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Shield className="h-5 w-5" />
                Power User Portal
              </CardTitle>
              <CardDescription className="text-purple-700">
                Advanced management and operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100" asChild>
                <Link to="/power-user">Power User</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Settings className="h-5 w-5" />
                Admin Portal
              </CardTitle>
              <CardDescription className="text-red-700">
                System administration and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100" asChild>
                <Link to="/admin">Admin Access</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EmployeeAccessSection;
