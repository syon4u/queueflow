
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: 'rating' | 'text' | 'multiple_choice';
  options?: Json | null;
  is_required: boolean;
  order_index: number;
}

interface CustomerSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  customerId: string;
  onSubmitSuccess?: () => void;
}

export const CustomerSurveyModal: React.FC<CustomerSurveyModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  customerId,
  onSubmitSuccess
}) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadSurveyQuestions();
    }
  }, [isOpen]);

  const loadSurveyQuestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      
      // Transform the data to match our interface with proper typing
      const typedQuestions: SurveyQuestion[] = (data || []).map(question => ({
        id: question.id,
        question_text: question.question_text,
        question_type: question.question_type as 'rating' | 'text' | 'multiple_choice',
        options: question.options,
        is_required: question.is_required,
        order_index: question.order_index
      }));
      
      setQuestions(typedQuestions);
    } catch (error) {
      console.error('Error loading survey questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load survey questions',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (questionId: string, rating: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: rating.toString()
    }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  const validateResponses = () => {
    const requiredQuestions = questions.filter(q => q.is_required);
    for (const question of requiredQuestions) {
      if (!responses[question.id] || responses[question.id].trim() === '') {
        return `Please answer: ${question.question_text}`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateResponses();
    if (validationError) {
      toast({
        title: 'Please complete required fields',
        description: validationError,
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create survey record
      const { data: surveyData, error: surveyError } = await supabase
        .from('customer_surveys')
        .insert({
          appointment_id: appointmentId,
          customer_id: customerId,
          rating: parseInt(responses[questions.find(q => q.question_type === 'rating')?.id || ''] || '0'),
          feedback: responses[questions.find(q => q.question_type === 'text')?.id || ''] || '',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Create detailed responses
      const responseData = Object.entries(responses).map(([questionId, value]) => ({
        survey_id: surveyData.id,
        question_id: questionId,
        response_value: value
      }));

      const { error: responsesError } = await supabase
        .from('survey_responses')
        .insert(responseData);

      if (responsesError) throw responsesError;

      toast({
        title: 'Survey Submitted',
        description: 'Thank you for your feedback!'
      });

      onSubmitSuccess?.();
      onClose();
      setResponses({});
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit survey. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingQuestion = (question: SurveyQuestion) => (
    <Card key={question.id} className="mb-4">
      <CardContent className="pt-4">
        <div className="mb-3">
          <h4 className="font-medium text-gray-900">
            {question.question_text}
            {question.is_required && <span className="text-red-500 ml-1">*</span>}
          </h4>
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingChange(question.id, rating)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-8 w-8 ${
                  parseInt(responses[question.id] || '0') >= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderTextQuestion = (question: SurveyQuestion) => (
    <Card key={question.id} className="mb-4">
      <CardContent className="pt-4">
        <div className="mb-3">
          <h4 className="font-medium text-gray-900">
            {question.question_text}
            {question.is_required && <span className="text-red-500 ml-1">*</span>}
          </h4>
        </div>
        <Textarea
          value={responses[question.id] || ''}
          onChange={(e) => handleTextChange(question.id, e.target.value)}
          placeholder="Please share your thoughts..."
          className="min-h-20"
        />
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {questions.map((question) => {
              switch (question.question_type) {
                case 'rating':
                  return renderRatingQuestion(question);
                case 'text':
                  return renderTextQuestion(question);
                default:
                  return null;
              }
            })}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Submitting...' : 'Submit Survey'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
