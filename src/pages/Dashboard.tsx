
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, Settings, LayoutDashboard, User, UserCog, Shield, FileText } from 'lucide-react';
import { UserRole } from '@/hooks/useUserRole';

const Dashboard = () => {
  const { user, role, signOut } = useAuth();

  // Determine which cards to show based on role
  const showCustomerCard = true; // Everyone can access customer pages
  const showStaffCard = ['staff', 'supervisor', 'power_user', 'admin'].includes(role as UserRole);
  const showSupervisorCard = ['supervisor', 'admin'].includes(role as UserRole);
  const showPowerUserCard = ['power_user', 'admin'].includes(role as UserRole);
  const showAdminCard = role === 'admin';

  // Get proper role display name
  const getRoleDisplayName = (role?: string | null): string => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'power_user': return 'Power User';
      case 'supervisor': return 'Supervisor';
      case 'staff': return 'Staff';
      case 'customer': return 'Customer';
      default: return 'Customer';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">Welcome Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.email} ({getRoleDisplayName(role)})
          </span>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the Service Portal</h2>
            <p className="text-lg text-gray-600">
              Please select the section you'd like to access
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Customer Card - Always shown */}
            {showCustomerCard && (
              <Card className="hover:shadow-lg transition-all duration-200 border-t-4 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Customer Portal
                  </CardTitle>
                  <CardDescription>
                    Book appointments and manage your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Access your appointments, book new services, and update your personal information.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Link to="/customer">
                      Enter Customer Portal
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Staff Card */}
            {showStaffCard && (
              <Card className="hover:shadow-lg transition-all duration-200 border-t-4 border-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Staff Portal
                  </CardTitle>
                  <CardDescription>
                    Manage appointments and customer service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    View your schedule, manage appointments, and track your performance.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-gradient-to-r from-green-600 to-teal-600">
                    <Link to="/staff">
                      Enter Staff Portal
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Supervisor Card */}
            {showSupervisorCard && (
              <Card className="hover:shadow-lg transition-all duration-200 border-t-4 border-amber-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-amber-600" />
                    Supervisor Portal
                  </CardTitle>
                  <CardDescription>
                    Staff management and team metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Manage staff schedules, review performance metrics, and handle escalations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-gradient-to-r from-amber-600 to-orange-500">
                    <Link to="/supervisor">
                      Enter Supervisor Portal
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Power User Card */}
            {showPowerUserCard && (
              <Card className="hover:shadow-lg transition-all duration-200 border-t-4 border-indigo-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Power User Portal
                  </CardTitle>
                  <CardDescription>
                    Advanced features and reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Access advanced system features, generate reports, and customize workflows.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-violet-600">
                    <Link to="/power-user">
                      Enter Power User Portal
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Admin Card */}
            {showAdminCard && (
              <Card className="hover:shadow-lg transition-all duration-200 border-t-4 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    Admin Portal
                  </CardTitle>
                  <CardDescription>
                    System configuration and management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Manage users, configure services, and view system-wide reports and analytics.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Link to="/admin">
                      Enter Admin Portal
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-4 px-6 text-center text-sm text-gray-500">
        <p>&copy; 2025 Service Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
