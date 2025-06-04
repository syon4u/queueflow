
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3';
  estimatedHours: number;
  status: 'not-started' | 'in-progress' | 'completed';
  dependencies?: string[];
}

const queueFlow2Tasks: Task[] = [
  // Phase 1 - Critical (P0)
  {
    id: 'virtual-queue',
    title: 'Virtual Queue & PWA',
    description: 'Implement Progressive Web App with virtual queue functionality',
    priority: 'P0',
    phase: 'Phase 1',
    estimatedHours: 16,
    status: 'completed'
  },
  {
    id: 'qr-codes',
    title: 'QR Code Generation & Scanning',
    description: 'Generate QR codes for tickets and implement scanning functionality',
    priority: 'P0',
    phase: 'Phase 1',
    estimatedHours: 8,
    status: 'completed'
  },
  {
    id: 'two-way-sms',
    title: 'Two-Way SMS Commands',
    description: 'Parse SMS commands: R (status), LATE X (delay), CANCEL',
    priority: 'P0',
    phase: 'Phase 1',
    estimatedHours: 12,
    status: 'not-started'
  },
  {
    id: 'capacity-engine',
    title: 'Capacity Throttling Engine',
    description: 'Implement capacity rules per service×location×date with auto-throttling',
    priority: 'P0',
    phase: 'Phase 1',
    estimatedHours: 16,
    status: 'not-started'
  },
  {
    id: 'digital-signage',
    title: 'Digital Signage Feed',
    description: 'WebSocket feed for "Now Serving" displays',
    priority: 'P0',
    phase: 'Phase 1',
    estimatedHours: 8,
    status: 'not-started'
  },
  // Phase 2 - Medium Priority (P1)
  {
    id: 'ai-predictions',
    title: 'AI Wait-Time Prediction',
    description: 'Simple ML model for wait time and staffing predictions',
    priority: 'P1',
    phase: 'Phase 2',
    estimatedHours: 20,
    status: 'not-started',
    dependencies: ['capacity-engine']
  },
  {
    id: 'csat-surveys',
    title: 'CSAT/NPS Survey System',
    description: 'Post-visit customer satisfaction surveys',
    priority: 'P1',
    phase: 'Phase 2',
    estimatedHours: 12,
    status: 'not-started'
  },
  {
    id: 'kiosk-interface',
    title: 'Walk-in Kiosk Interface',
    description: 'Self-service kiosk for walk-in customers',
    priority: 'P1',
    phase: 'Phase 2',
    estimatedHours: 16,
    status: 'not-started'
  },
  {
    id: 'enhanced-rbac',
    title: 'Enhanced RBAC',
    description: 'Implement Power User role with granular permissions',
    priority: 'P1',
    phase: 'Phase 2',
    estimatedHours: 8,
    status: 'not-started'
  },
  // Phase 3 - Enhancements (P2)
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics & BI',
    description: 'Real-time widgets, BI integration, scheduled reports',
    priority: 'P2',
    phase: 'Phase 3',
    estimatedHours: 24,
    status: 'not-started',
    dependencies: ['ai-predictions']
  },
  {
    id: 'openapi-spec',
    title: 'OpenAPI Specification',
    description: 'Publish OpenAPI 3.1 spec with webhooks',
    priority: 'P2',
    phase: 'Phase 3',
    estimatedHours: 8,
    status: 'not-started'
  },
  {
    id: 'performance-monitoring',
    title: 'Performance Monitoring',
    description: 'SLA monitoring, performance dashboards',
    priority: 'P2',
    phase: 'Phase 3',
    estimatedHours: 12,
    status: 'not-started'
  },
  {
    id: 'wcag-compliance',
    title: 'WCAG 2.2 AA Compliance',
    description: 'Full accessibility compliance audit and fixes',
    priority: 'P2',
    phase: 'Phase 3',
    estimatedHours: 16,
    status: 'not-started'
  }
];

export const QueueFlow2TaskTracker: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(queueFlow2Tasks);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'not-started' : 
                         task.status === 'not-started' ? 'in-progress' : 'completed';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const getNextTask = () => {
    const availableTasks = tasks.filter(task => {
      if (task.status === 'completed') return false;
      if (!task.dependencies) return true;
      return task.dependencies.every(depId => 
        tasks.find(t => t.id === depId)?.status === 'completed'
      );
    });
    
    return availableTasks.sort((a, b) => {
      const priorityOrder = { 'P0': 0, 'P1': 1, 'P2': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })[0];
  };

  const nextTask = getNextTask();
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = (completedTasks / totalTasks) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-500';
      case 'P1': return 'bg-orange-500';
      case 'P2': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            QueueFlow 2.0 Implementation Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-600">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <Progress value={progressPercent} className="w-full" />
          
          {nextTask && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Next Recommended Task:</span>
              </div>
              <div className="text-blue-800">
                <div className="font-medium">{nextTask.title}</div>
                <div className="text-sm">{nextTask.description}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getPriorityColor(nextTask.priority)}>{nextTask.priority}</Badge>
                  <span className="text-xs">Est: {nextTask.estimatedHours}h</span>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentTaskId(nextTask.id)}
                className="mt-2"
                size="sm"
              >
                Start This Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task List by Phase */}
      {['Phase 1', 'Phase 2', 'Phase 3'].map(phase => (
        <Card key={phase}>
          <CardHeader>
            <CardTitle className="text-lg">{phase}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.filter(task => task.phase === phase).map(task => (
                <div 
                  key={task.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                    currentTaskId === task.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(task.status)}
                      <span className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </span>
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Est: {task.estimatedHours}h</span>
                      {task.dependencies && (
                        <span>Depends on: {task.dependencies.join(', ')}</span>
                      )}
                    </div>
                  </div>

                  {task.status !== 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentTaskId(task.id === currentTaskId ? null : task.id)}
                    >
                      {currentTaskId === task.id ? 'Working...' : 'Work on This'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
