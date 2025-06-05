
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, MessageSquare, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCustomerSurvey } from '@/hooks/use-customer-survey';

export const CustomerSatisfactionAnalytics = () => {
  const { surveyStats, statsLoading } = useCustomerSurvey();

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!surveyStats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No survey data available</p>
        </CardContent>
      </Card>
    );
  }

  const ratingChartData = Object.entries(surveyStats.ratingDistribution)
    .map(([rating, count]) => ({
      rating: `${rating} Star${rating !== '1' ? 's' : ''}`,
      count,
      percentage: ((count / surveyStats.totalSurveys) * 100).toFixed(1)
    }))
    .sort((a, b) => parseInt(b.rating) - parseInt(a.rating));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                <p className="text-2xl font-bold text-gray-900">{surveyStats.totalSurveys}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold text-gray-900">{surveyStats.averageRating}</p>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {surveyStats.totalSurveys > 0 
                    ? Math.round(((surveyStats.ratingDistribution[4] || 0) + (surveyStats.ratingDistribution[5] || 0)) / surveyStats.totalSurveys * 100)
                    : 0}%
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{surveyStats.recentFeedback.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} responses (${ratingChartData.find(d => d.count === value)?.percentage}%)`,
                    'Count'
                  ]}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {surveyStats.recentFeedback.map((feedback) => (
                <div key={feedback.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(feedback.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  {feedback.feedback && (
                    <p className="text-sm text-gray-700">{feedback.feedback}</p>
                  )}
                </div>
              ))}
              {surveyStats.recentFeedback.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent feedback available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
