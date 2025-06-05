import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, UserCheck, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome to the Broward County Queue Management System
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl">
          Streamlining services and improving customer experience across Broward County.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Portal
            </CardTitle>
            <CardDescription>
              Schedule appointments and manage your visits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to="/customer">Access Customer Portal</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Staff Portal
            </CardTitle>
            <CardDescription>
              Manage appointments and serve customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/staff">Access Staff Portal</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Power User Portal
            </CardTitle>
            <CardDescription>
              Advanced management tools and operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/power-user">Access Power User Portal</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Portal
            </CardTitle>
            <CardDescription>
              System administration and configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/admin">Access Admin Portal</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.5 5.25a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5H11.25V7.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Appointments
            </CardTitle>
            <CardDescription>View all appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/appointments">View Appointments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.25H21a.75.75 0 0 0 0-1.5h-6.75a.75.75 0 0 0 0 1.5Zm-2.25 3a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM4.5 15.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 17.25H21a.75.75 0 0 0 0-1.5h-6.75a.75.75 0 0 0 0 1.5Zm-2.25 3a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z"
                />
              </svg>
              Virtual Queue
            </CardTitle>
            <CardDescription>Join the virtual queue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/queue">Join Queue</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5a2.25 2.25 0 0 1 2.25 2.25v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6Zm3-1.5a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75ZM7.5 9a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H8.25a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75Zm6.75-1.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              Kiosk
            </CardTitle>
            <CardDescription>Kiosk check-in interface</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/kiosk">Go to Kiosk</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  d="M4.5 5.625c0-1.548 1.254-2.802 2.802-2.802 2.294 0 3.823 2.294 2.802 4.586-1.077 2.427-4.759 2.427-5.604 0ZM18.75 19.5a.75.75 0 0 1-1.5 0v-4.5h-2.25a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75v5.25ZM12.75 5.625c0-1.548 1.254-2.802 2.802-2.802 2.294 0 3.823 2.294 2.802 4.586-1.077 2.427-4.759 2.427-5.604 0ZM5.25 19.5a.75.75 0 0 0-1.5 0v-4.5h-2.25a.75.75 0 0 0 0-1.5h3a.75.75 0 0 0 .75.75v5.25ZM18.75 11.25a.75.75 0 0 1-.75.75h-5.844l1.723 3.447a.75.75 0 0 1-1.214.966l-2.559-5.117a.75.75 0 0 1 .966-1.214l3.447 1.723V6a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v5.25ZM11.25 11.25a.75.75 0 0 0 .75.75h5.844l-1.723 3.447a.75.75 0 0 0 1.214.966l2.559-5.117a.75.75 0 0 0-.966-1.214l-3.447 1.723V6a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75v5.25Z"
                />
              </svg>
              Digital Signage
            </CardTitle>
            <CardDescription>Appointment display board</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/signage">View Signage</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3.75 2.25a.75.75 0 0 1 .75.75v1.313a3 3 0 0 0 2.34 2.34L7.5 7.5h6L13.5 7.5a3 3 0 0 0 2.34-2.34l.038-.038a.75.75 0 0 1 1.061.038l1.462 1.462a.75.75 0 0 1-.038 1.061l-.037.037a3 3 0 0 0-2.34 2.34L16.5 12h-6l-.038-.038a3 3 0 0 0-2.34-2.34l-.037-.037a.75.75 0 0 1 1.06.038l1.463 1.462a.75.75 0 0 1-.038 1.06L7.875 12A3 3 0 0 0 5.535 9.66l-.038-.037a.75.75 0 0 1 1.06.038l1.463 1.462a.75.75 0 0 1-.038 1.06L7.875 15A3 3 0 0 0 5.535 12.66l-.038-.037a.75.75 0 0 1 1.06.038l1.463 1.462a3 3 0 0 0 2.34 2.34L13.5 18h-6a3 3 0 0 0-2.34 2.34l-.038.038a.75.75 0 0 1-1.061-.038l-1.462-1.462a.75.75 0 0 1 .038-1.061l.037-.037a3 3 0 0 0 2.34-2.34L7.5 16.5h6l.038.038a3 3 0 0 0 2.34 2.34l.037.037a.75.75 0 0 1-1.06-.038l-1.463-1.462a.75.75 0 0 1 .038-1.06L16.125 18A3 3 0 0 0 18.465 20.34l.038.037a.75.75 0 0 1-1.06-.038l-1.463-1.462a.75.75 0 0 1 .038-1.06L16.125 15a3 3 0 0 0 2.34-2.34l.038-.038a.75.75 0 0 1 .75.75v1.313a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75V2.25Z"
                  clipRule="evenodd"
                />
              </svg>
              Mobile Queue
            </CardTitle>
            <CardDescription>Join the queue from your mobile device</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/mobile-queue">Join Mobile Queue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
