
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            QueueFlow Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your appointment scheduling and queue management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Customer Portal
              </CardTitle>
              <CardDescription>
                Book appointments and manage your schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/customer">
                <Button className="w-full">Access Portal</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Staff Dashboard
              </CardTitle>
              <CardDescription>
                Manage appointments and customer queues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/staff">
                <Button className="w-full" variant="secondary">Access Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Power User
              </CardTitle>
              <CardDescription>
                Advanced analytics and reporting tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/power-user">
                <Button className="w-full" variant="outline">Access Tools</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                Admin Panel
              </CardTitle>
              <CardDescription>
                System administration and user management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin">
                <Button className="w-full" variant="destructive">Admin Access</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help? Contact support or view documentation
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Authentication (Optional)</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
