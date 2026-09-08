
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <Card 
        className="max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">{t('landing.guide.title')}</h3>
          <p className="mb-4 text-gray-600">
            {t('landing.guide.description')}
          </p>
          <Button 
            onClick={onClose} 
            className="w-full"
          >
            {t('landing.guide.button')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeGuideModal;
