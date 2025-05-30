
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, Settings, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { user, role, signOut } = useAuth();

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
            {user?.email} ({role || 'customer'})
          </span>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the Service Portal</h2>
            <p className="text-lg text-gray-600">
              Please select the section you'd like to access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Card */}
            <Card className="hover:shadow-lg transition-all duration-200 border-t-4 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
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

            {/* Staff Card - Only shown if user has staff or admin role */}
            {(role === 'staff' || role === 'admin') && (
              <Card className="hover:shadow-lg transition-all duration-200 border-t-4 border-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-green-600" />
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

            {/* Admin Card - Only shown if user has admin role */}
            {role === 'admin' && (
              <Card className="hover:shadow-lg transition-all duration-200 border-t-4 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
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
