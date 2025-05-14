
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PortalCardProps {
  title: string;
  description: string;
  content: string;
  icon: LucideIcon;
  linkText: string;
  linkUrl: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const PortalCard: React.FC<PortalCardProps> = ({
  title,
  description,
  content,
  icon: Icon,
  linkText,
  linkUrl,
  accentColor,
  gradientFrom,
  gradientTo,
}) => {
  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-t-4 ${accentColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          {content}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className={`w-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>
          <Link to={linkUrl}>
            {linkText}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PortalCard;
