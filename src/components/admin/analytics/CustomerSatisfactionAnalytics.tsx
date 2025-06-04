
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CustomerSatisfactionAnalyticsProps {
  data?: Array<{
    id: string;
    rating: number;
    feedback?: string;
    wait_time_rating?: number;
    service_quality_rating?: number;
    overall_experience_rating?: number;
    would_recommend?: boolean;
    created_at: string;
    customer?: { first_name: string; last_name: string };
    location?: { name: string };
    service?: { name: string };
    staff?: { first_name: string; last_name: string };
  }>;
}

const CustomerSatisfactionAnalytics: React.FC<CustomerSatisfactionAnalyticsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Star className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">No customer satisfaction data available</p>
            <p className="text-sm text-gray-400 mt-2">Customer feedback will appear here once submitted</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate summary metrics
  const totalResponses = data.length;
  const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / totalResponses;
  const recommendationRate = data.filter(item => item.would_recommend).length / totalResponses * 100;
  
  // Rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating !== 1 ? 's' : ''}`,
    count: data.filter(item => item.rating === rating).length,
    percentage: (data.filter(item => item.rating === rating).length / totalResponses * 100).toFixed(1)
  }));

  // Category ratings (wait time, service quality, overall experience)
  const categoryRatings = [
    {
      category: 'Wait Time',
      average: data.filter(item => item.wait_time_rating).length > 0 
        ? data.reduce((sum, item) => sum + (item.wait_time_rating || 0), 0) / data.filter(item => item.wait_time_rating).length
        : 0
    },
    {
      category: 'Service Quality',
      average: data.filter(item => item.service_quality_rating).length > 0
        ? data.reduce((sum, item) => sum + (item.service_quality_rating || 0), 0) / data.filter(item => item.service_quality_rating).length
        : 0
    },
    {
      category: 'Overall Experience',
      average: data.filter(item => item.overall_experience_rating).length > 0
        ? data.reduce((sum, item) => sum + (item.overall_experience_rating || 0), 0) / data.filter(item => item.overall_experience_rating).length
        : 0
    }
  ];

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalResponses}</p>
                <p className="text-sm text-gray-600">Total Responses</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}/5</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{recommendationRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Would Recommend</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data.filter(item => item.rating >= 4).length}
                </p>
                <p className="text-sm text-gray-600">Positive Reviews</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of customer ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rating, percentage }) => `${rating}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Average ratings by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryRatings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value) => [Number(value).toFixed(1), 'Average Rating']}
                />
                <Bar dataKey="average" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Feedback</CardTitle>
          <CardDescription>Latest customer comments and ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data
              .filter(item => item.feedback && item.feedback.trim().length > 0)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.customer?.first_name} {item.customer?.last_name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.location?.name} - {item.service?.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{item.feedback}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {item.would_recommend && (
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        Would recommend
                      </span>
                    )}
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSatisfactionAnalytics;
