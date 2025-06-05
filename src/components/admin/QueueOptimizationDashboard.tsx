
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Users, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
  BarChart3
} from 'lucide-react';
import { useQueueOptimization } from '@/hooks/use-queue-optimization';

export const QueueOptimizationDashboard = () => {
  const {
    recommendations,
    recommendationsLoading,
    isOptimizing,
    applyOptimization,
    applyBatchOptimizations
  } = useQueueOptimization();

  // Calculate summary metrics
  const totalTimeSavings = recommendations?.reduce((sum, rec) => sum + rec.estimatedSavings.timeMinutes, 0) || 0;
  const highImpactCount = recommendations?.filter(rec => rec.impact === 'high').length || 0;
  const totalCustomersAffected = recommendations?.reduce((sum, rec) => sum + rec.estimatedSavings.customerCount, 0) || 0;

  const handleApplyAll = () => {
    if (recommendations && recommendations.length > 0) {
      applyBatchOptimizations(recommendations.slice(0, 5)); // Apply top 5 recommendations
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">Dynamic Queue Optimization</h2>
          <p className="text-muted-foreground">
            AI-powered real-time queue reordering and optimization recommendations
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleApplyAll}
            disabled={isOptimizing || !recommendations?.length}
            className="flex items-center gap-2"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Apply Top 5
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
                  {recommendations?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Active Recommendations</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Badge variant="outline" className="mt-2">Real-time Analysis</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTimeSavings}min
                </p>
                <p className="text-sm text-gray-600">Potential Time Savings</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <Badge 
              variant={totalTimeSavings > 60 ? "default" : "secondary"}
              className="mt-2"
            >
              {totalTimeSavings > 60 ? "High Impact" : "Moderate Impact"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {highImpactCount}
                </p>
                <p className="text-sm text-gray-600">High Priority Items</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <Badge variant="outline" className="mt-2">Critical Optimizations</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCustomersAffected}
                </p>
                <p className="text-sm text-gray-600">Customers Affected</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <Badge variant="outline" className="mt-2">Queue Impact</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
          <CardDescription>
            Real-time analysis of queue efficiency with actionable recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendationsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              recommendations.slice(0, 10).map((rec, index) => (
                <div key={`${rec.appointmentId}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={rec.impact === 'high' ? 'destructive' : rec.impact === 'medium' ? 'default' : 'secondary'}>
                        {rec.impact} impact
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        {rec.currentPosition > rec.recommendedPosition ? (
                          <ArrowUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-red-600" />
                        )}
                        Position: {rec.currentPosition} → {rec.recommendedPosition}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{rec.reason}</p>
                    <div className="text-xs text-gray-500">
                      Estimated savings: {rec.estimatedSavings.timeMinutes} minutes • 
                      Affects {rec.estimatedSavings.customerCount} customers
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => applyOptimization(rec)}
                    disabled={isOptimizing}
                    className="ml-4"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Apply
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No optimization opportunities found</p>
                <p className="text-sm mt-1">Queue is already optimally organized</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Queue Optimization Active</AlertTitle>
        <AlertDescription>
          The system is continuously monitoring queue efficiency and will automatically suggest optimizations 
          every 30 seconds. High-impact recommendations are prioritized for immediate action.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default QueueOptimizationDashboard;
