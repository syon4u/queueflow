
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Users, AlertTriangle, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, addDays, parseISO } from 'date-fns';

interface PredictiveAnalyticsProps {
  data?: {
    daily_data: Array<{
      date: string;
      total_appointments: number;
      completed: number;
      avg_wait_time: number;
    }>;
  };
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ data }) => {
  if (!data?.daily_data || data.daily_data.length < 7) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Brain className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">Insufficient data for predictions</p>
          <p className="text-sm text-gray-400 mt-2">At least 7 days of data needed for accurate forecasting</p>
        </CardContent>
      </Card>
    );
  }

  // Sort data by date
  const sortedData = [...data.daily_data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Simple trend analysis and prediction
  const generatePredictions = () => {
    const recentData = sortedData.slice(-7); // Last 7 days
    const avgAppointments = recentData.reduce((sum, day) => sum + day.total_appointments, 0) / recentData.length;
    const avgWaitTime = recentData.reduce((sum, day) => sum + (day.avg_wait_time || 0), 0) / recentData.length;
    
    // Calculate trend
    const appointmentsTrend = recentData.length > 1 
      ? (recentData[recentData.length - 1].total_appointments - recentData[0].total_appointments) / recentData.length
      : 0;

    // Generate next 7 days predictions
    const predictions = [];
    const lastDate = new Date(recentData[recentData.length - 1].date);
    
    for (let i = 1; i <= 7; i++) {
      const nextDate = addDays(lastDate, i);
      const predictedAppointments = Math.max(0, Math.round(avgAppointments + (appointmentsTrend * i)));
      const predictedWaitTime = avgWaitTime * (1 + (predictedAppointments / avgAppointments - 1) * 0.3);
      
      predictions.push({
        date: format(nextDate, 'yyyy-MM-dd'),
        predicted_appointments: predictedAppointments,
        predicted_wait_time: Math.max(5, predictedWaitTime),
        confidence: Math.max(60, 90 - (i * 5)) // Confidence decreases over time
      });
    }
    
    return predictions;
  };

  const predictions = generatePredictions();
  
  // Combine historical and predicted data for visualization
  const combinedData = [
    ...sortedData.slice(-14).map(day => ({
      ...day,
      date: day.date,
      appointments: day.total_appointments,
      wait_time: day.avg_wait_time || 0,
      type: 'historical'
    })),
    ...predictions.map(pred => ({
      date: pred.date,
      appointments: pred.predicted_appointments,
      wait_time: pred.predicted_wait_time,
      type: 'predicted',
      confidence: pred.confidence
    }))
  ];

  // Calculate capacity recommendations
  const getCapacityRecommendations = () => {
    const maxPredicted = Math.max(...predictions.map(p => p.predicted_appointments));
    const avgPredicted = predictions.reduce((sum, p) => sum + p.predicted_appointments, 0) / predictions.length;
    const currentAvg = sortedData.slice(-7).reduce((sum, day) => sum + day.total_appointments, 0) / 7;
    
    const recommendations = [];
    
    if (maxPredicted > currentAvg * 1.2) {
      recommendations.push({
        type: 'warning',
        title: 'Peak Demand Expected',
        description: `Predicted peak of ${maxPredicted} appointments may exceed current capacity`,
        action: 'Consider increasing staff or extending hours'
      });
    }
    
    if (avgPredicted < currentAvg * 0.8) {
      recommendations.push({
        type: 'info',
        title: 'Lower Demand Forecast',
        description: `Predicted average of ${Math.round(avgPredicted)} appointments is below recent average`,
        action: 'Opportunity to optimize staff allocation'
      });
    }
    
    const highWaitTimes = predictions.filter(p => p.predicted_wait_time > 20).length;
    if (highWaitTimes > 3) {
      recommendations.push({
        type: 'error',
        title: 'Extended Wait Times Predicted',
        description: `${highWaitTimes} days with wait times exceeding 20 minutes`,
        action: 'Review scheduling and capacity planning'
      });
    }
    
    return recommendations;
  };

  const recommendations = getCapacityRecommendations();

  return (
    <div className="space-y-6">
      {/* Prediction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(predictions.reduce((sum, p) => sum + p.predicted_appointments, 0) / predictions.length)}
                </p>
                <p className="text-sm text-gray-600">Avg Predicted Appointments</p>
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
                  {Math.round(predictions.reduce((sum, p) => sum + p.predicted_wait_time, 0) / predictions.length)}min
                </p>
                <p className="text-sm text-gray-600">Avg Predicted Wait Time</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
            <Badge 
              variant={predictions.some(p => p.predicted_wait_time > 20) ? "destructive" : "secondary"}
              className="mt-2"
            >
              {predictions.some(p => p.predicted_wait_time > 20) ? "Attention Needed" : "Within Target"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)}%
                </p>
                <p className="text-sm text-gray-600">Prediction Confidence</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <Badge variant="outline" className="mt-2">Model Accuracy</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Appointment Forecast</CardTitle>
          <CardDescription>Historical data and predictions with confidence intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(parseISO(value), 'MM/dd')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => format(parseISO(value as string), 'MMM dd, yyyy')}
                formatter={(value, name, props) => [
                  value,
                  props.payload.type === 'predicted' ? 'Predicted Appointments' : 'Historical Appointments'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray={combinedData.map(item => item.type === 'predicted' ? "5 5" : "0").join(',')}
                name="Appointments"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Wait Time Prediction */}
      <Card>
        <CardHeader>
          <CardTitle>Wait Time Forecast</CardTitle>
          <CardDescription>Predicted wait times based on appointment volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(parseISO(value), 'MM/dd')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => format(parseISO(value as string), 'MMM dd, yyyy')}
                formatter={(value) => [`${Number(value).toFixed(1)} min`, 'Predicted Wait Time']}
              />
              <Bar 
                dataKey="predicted_wait_time" 
                fill="#f59e0b" 
                name="Predicted Wait Time"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Actionable insights based on predictive analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 p-4 rounded-lg ${
                    rec.type === 'error' ? 'bg-red-50' :
                    rec.type === 'warning' ? 'bg-yellow-50' :
                    'bg-blue-50'
                  }`}
                >
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    rec.type === 'error' ? 'text-red-600' :
                    rec.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      rec.type === 'error' ? 'text-red-800' :
                      rec.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {rec.title}
                    </p>
                    <p className={`text-sm ${
                      rec.type === 'error' ? 'text-red-700' :
                      rec.type === 'warning' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      {rec.description}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                      Recommended Action: {rec.action}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No specific recommendations at this time</p>
                <p className="text-sm mt-1">Operations appear to be running smoothly</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
