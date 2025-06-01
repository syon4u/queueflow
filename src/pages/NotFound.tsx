import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BrowardLayout from "@/components/layout/BrowardLayout";
import BrowardHero from "@/components/layout/BrowardHero";
import BrowardButton from "@/components/ui/broward-button";
import BrowardCard from "@/components/ui/broward-card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <BrowardLayout headerTitle="Page Not Found">
      <BrowardHero 
        title="404 - Page Not Found" 
        subtitle="The page you are looking for doesn't exist or has been moved"
        backgroundStyle="pattern"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <BrowardCard elevation="md" className="text-center">
            <div className="py-8">
              <h2 className="text-6xl font-serif text-bc-navy dark:text-bc-blue mb-4">404</h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">Oops! Page not found</p>
              
              <BrowardButton asChild>
                <a href="/">Return to Home</a>
              </BrowardButton>
            </div>
          </BrowardCard>
        </div>
      </div>
    </BrowardLayout>
  );
};

export default NotFound;