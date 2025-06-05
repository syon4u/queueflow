
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Shield, Settings, Calendar, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const [showStaffAccess, setShowStaffAccess] = useState(false);
  const { t } = useTranslation();

  return (
    <PageLayout 
      headerTitle="Broward County Queue Management System"
      headerSubtitle="Streamlining services and improving customer experience"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to Broward County
              <span className="block text-blue-200">Queue Management System</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
              Experience efficient, modern service delivery with our comprehensive queue management solution. 
              Schedule appointments, track wait times, and manage your visits seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
                <Link to="/customer">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700" asChild>
                <Link to="/appointments">View Schedule</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Service Cards */}
        <section className="py-16 -mt-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Customer Portal Card */}
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Customer Portal</CardTitle>
                  <CardDescription className="text-gray-600">
                    Schedule appointments and manage your visits with ease
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" asChild>
                    <Link to="/customer">Access Portal</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Virtual Queue Card */}
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Virtual Queue</CardTitle>
                  <CardDescription className="text-gray-600">
                    Join the queue remotely and track your position in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" asChild>
                    <Link to="/queue">Join Queue</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Appointments Card */}
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Appointments</CardTitle>
                  <CardDescription className="text-gray-600">
                    View and manage all your scheduled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg" asChild>
                    <Link to="/appointments">View Schedule</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    Kiosk Check-in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/kiosk">Use Kiosk</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.25H21a.75.75 0 0 0 0-1.5h-6.75a.75.75 0 0 0 0 1.5Z"/>
                    </svg>
                    Digital Signage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/signage">View Display</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.219l2.85-2.85a.75.75 0 0 1 1.06 1.061l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.061l2.85 2.85V1.875Z"/>
                    </svg>
                    Mobile Queue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/mobile-queue">Mobile Access</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow relative">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserCheck className="h-5 w-5 text-indigo-600" />
                    Staff Access
                    <Badge variant="secondary" className="ml-auto text-xs">Restricted</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowStaffAccess(!showStaffAccess)}
                  >
                    {showStaffAccess ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                    {showStaffAccess ? 'Hide' : 'Show'} Access
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Retractable Staff/Admin Access */}
            {showStaffAccess && (
              <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Staff & Administrative Access</h3>
                    <p className="text-sm text-gray-600">Restricted access portals for authorized personnel</p>
                  </div>
                  <Badge variant="destructive">Restricted</Badge>
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
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our System?</h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
              Experience the benefits of modern queue management technology designed for efficiency and convenience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600">Get live updates on wait times and queue positions</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
                <p className="text-gray-600">Book appointments online with flexible time slots</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Service</h3>
                <p className="text-gray-600">Improved customer experience with reduced wait times</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Index;
