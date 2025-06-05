
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';
import { usePredictiveScheduling } from '@/hooks/use-predictive-scheduling';

export const PredictiveSchedulingDashboard = () => {
  const {
    predictions,
    patterns,
    recommendations,
    accuracy,
    predictionsLoading,
    patternsLoading,
    recommendationsLoading,
    isGenerating,
    isCalculating,
    calculateDemandPatterns,
    generatePredictions,
    applyRecommendation,
    rejectRecommendation
  } = usePredictiveScheduling();

  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [predictionDays, setPredictionDays] = useState<number>(7);

  // Calculate summary metrics
  const summaryMetrics = {
    totalPredictions: predictions?.length || 0,
    averageConfidence: predictions?.reduce((sum, p) => sum + p.confidence_score, 0) / (predictions?.length || 1) * 100,
    pendingRecommendations: recommendations?.filter(r => r.status === 'pending').length || 0,
    modelAccuracy: accuracy?.[0]?.accuracy_percentage || 0
  };

  // Prepare chart data for demand predictions
  const predictionChartData = predictions?.slice(0, 168).map(pred => ({
    time: `${format(parseISO(pred.prediction_date), 'MM/dd')} ${pred.hour_of_day}:00`,
    predicted_demand: pred.predicted_demand,
    confidence: pred.confidence_score * 100,
    actual_demand: pred.actual_demand || null
  })) || [];

  // Prepare chart data for patterns
  const patternChartData = patterns?.slice(0, 24).map(pattern => {
    const [, , hourStr] = pattern.pattern_key.split('_');
    return {
      hour: parseInt(hourStr),
      average_demand: pattern.average_demand,
      peak_demand: pattern.peak_demand,
      sample_size: pattern.sample_size
    };
  }).sort((a, b) => a.hour - b.hour) || [];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">Predictive Scheduling Engine</h2>
          <p className="text-muted-foreground">
            AI-powered demand forecasting and intelligent appointment scheduling
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => calculateDemandPatterns()}
            disabled={isCalculating}
            variant="outline"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Calculate Patterns
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => generatePredictions(selectedLocation || 'demo-location', predictionDays)}
            disabled={isGenerating || !selectedLocation}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Predictions
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryMetrics.totalPredictions}
                </p>
                <p className="text-sm text-gray-600">Active Predictions</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <Badge variant="outline" className="mt-2">Next 7 days</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryMetrics.averageConfidence.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Avg Confidence</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <Badge 
              variant={summaryMetrics.averageConfidence > 75 ? "default" : "secondary"}
              className="mt-2"
            >
              {summaryMetrics.averageConfidence > 75 ? "High" : "Medium"} Confidence
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryMetrics.pendingRecommendations}
                </p>
                <p className="text-sm text-gray-600">Pending Actions</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <Badge variant="outline" className="mt-2">Recommendations</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryMetrics.modelAccuracy.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Model Accuracy</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <Badge 
              variant={summaryMetrics.modelAccuracy > 80 ? "default" : "secondary"}
              className="mt-2"
            >
              {summaryMetrics.modelAccuracy > 80 ? "Excellent" : "Good"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Demand Predictions
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Historical Patterns
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="accuracy" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Model Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Demand Forecast</CardTitle>
              <CardDescription>
                AI-powered predictions for appointment demand with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictionsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictionChartData.slice(0, 48)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(value) => value.split(' ')[1]}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => `Time: ${value}`}
                      formatter={(value, name) => [
                        name === 'predicted_demand' ? `${value} appointments` : `${value}%`,
                        name === 'predicted_demand' ? 'Predicted Demand' : 'Confidence'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted_demand" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Predicted Demand"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#10b981" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="Confidence"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Demand Patterns</CardTitle>
              <CardDescription>
                Learned patterns from historical appointment data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patternsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={patternChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour"
                      tickFormatter={(value) => `${value}:00`}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => `Hour: ${value}:00`}
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)}`,
                        name === 'average_demand' ? 'Average Demand' : 'Peak Demand'
                      ]}
                    />
                    <Bar dataKey="average_demand" fill="#3b82f6" name="Average Demand" />
                    <Bar dataKey="peak_demand" fill="#ef4444" name="Peak Demand" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Scheduling Recommendations</CardTitle>
              <CardDescription>
                Smart recommendations for capacity and staffing optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendationsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : recommendations && recommendations.length > 0 ? (
                  recommendations.slice(0, 10).map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {format(parseISO(rec.recommendation_date), 'MMM dd')} at {rec.hour_of_day}:00
                          </Badge>
                          <Badge variant={rec.status === 'pending' ? 'default' : rec.status === 'applied' ? 'secondary' : 'destructive'}>
                            {rec.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Recommended: {rec.recommended_capacity} capacity, {rec.recommended_staff} staff
                        </p>
                        {rec.reasoning && (
                          <p className="text-xs text-gray-500 mt-1">{rec.reasoning}</p>
                        )}
                      </div>
                      
                      {rec.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => applyRecommendation(rec.id)}
                            className="h-8"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Apply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectRecommendation(rec.id)}
                            className="h-8"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recommendations available</p>
                    <p className="text-sm mt-1">Generate predictions to see scheduling recommendations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Tracking</CardTitle>
              <CardDescription>
                Monitor prediction accuracy and model performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accuracyLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : accuracy && accuracy.length > 0 ? (
                <div className="space-y-4">
                  {accuracy.slice(0, 5).map((acc) => (
                    <div key={acc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {format(parseISO(acc.prediction_date), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Model: {acc.model_version} • {acc.total_predictions} predictions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {acc.accuracy_percentage?.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-600">
                          MAPE: {acc.mape?.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No accuracy data available</p>
                  <p className="text-sm mt-1">Accuracy will be calculated as predictions are validated</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveSchedulingDashboard;
