
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'not-started';
  priority: 'P0' | 'P1' | 'P2';
  description: string;
  dependencies?: string[];
}

const QueueFlow2TaskTracker: React.FC = () => {
  const tasks: Task[] = [
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics Dashboard',
      status: 'completed',
      priority: 'P0',
      description: 'Comprehensive analytics with predictive insights, customer satisfaction tracking, and operational metrics'
    },
    {
      id: 'capacity-management',
      name: 'Capacity Management System',
      status: 'completed',
      priority: 'P0',
      description: 'Real-time capacity monitoring, overflow handling, and emergency overrides'
    },
    {
      id: 'workload-distribution',
      name: 'Smart Workload Distribution',
      status: 'completed',
      priority: 'P0',
      description: 'Intelligent routing based on staff availability, specialties, and current workload'
    },
    {
      id: 'break-management',
      name: 'Smart Break Management',
      status: 'completed',
      priority: 'P1',
      description: 'Automated break scheduling with coverage recommendations and handover protocols'
    },
    {
      id: 'customer-communication',
      name: 'Enhanced Customer Communication',
      status: 'completed',
      priority: 'P1',
      description: 'Multi-channel communication system with templates and automated workflows'
    },
    {
      id: 'sms-commands',
      name: 'Two-Way SMS Commands',
      status: 'completed',
      priority: 'P0',
      description: 'SMS webhook integration with customer commands (RESCHEDULE, LATE, CANCEL)'
    },
    {
      id: 'capacity-throttling',
      name: 'Capacity Throttling Engine',
      status: 'completed',
      priority: 'P0',
      description: 'Enhanced capacity rules, auto-throttling, waitlist integration, and dynamic adjustments'
    },
    {
      id: 'realtime-queue-management',
      name: 'Real-time Queue Management',
      status: 'completed',
      priority: 'P0',
      description: 'Live queue tracking, real-time position updates, and staff queue controls'
    },
    {
      id: 'notification-system',
      name: 'Smart Notification System',
      status: 'in-progress',
      priority: 'P0',
      description: 'Intelligent notification timing, escalation, and multi-channel delivery',
      dependencies: ['customer-communication']
    },
    {
      id: 'predictive-scheduling',
      name: 'Predictive Scheduling Engine',
      status: 'not-started',
      priority: 'P1',
      description: 'AI-powered appointment scheduling with demand forecasting',
      dependencies: ['advanced-analytics', 'capacity-throttling']
    },
    {
      id: 'queue-optimization',
      name: 'Dynamic Queue Optimization',
      status: 'not-started',
      priority: 'P1',
      description: 'Real-time queue reordering and optimization algorithms',
      dependencies: ['workload-distribution']
    },
    {
      id: 'mobile-optimization',
      name: 'Mobile Experience Enhancement',
      status: 'not-started',
      priority: 'P2',
      description: 'Responsive design improvements and mobile-specific features'
    },
    {
      id: 'integration-api',
      name: 'External System Integration',
      status: 'not-started',
      priority: 'P2',
      description: 'API endpoints for third-party system integration'
    },
    {
      id: 'voice-notifications',
      name: 'Voice Call Notifications',
      status: 'not-started',
      priority: 'P1',
      description: 'Automated voice call system for customer notifications and confirmations'
    },
    {
      id: 'appointment-reminders',
      name: 'Automated Appointment Reminders',
      status: 'not-started',
      priority: 'P0',
      description: 'Smart reminder system with multiple touchpoints and escalation'
    }
  ];

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'not-started':
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">🚧 In Progress</Badge>;
      case 'not-started':
        return <Badge variant="outline">⏳ Not Started</Badge>;
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'P0':
        return <Badge variant="destructive">🔥 P0 - Critical</Badge>;
      case 'P1':
        return <Badge variant="default">⚡ P1 - High</Badge>;
      case 'P2':
        return <Badge variant="outline">📋 P2 - Medium</Badge>;
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const totalTasks = tasks.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  const nextTasks = tasks.filter(t => t.status === 'not-started' && t.priority === 'P0');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🚀 Queue Flow 2.0 - Implementation Progress
            <div className="flex items-center gap-3">
              <span className="text-sm font-normal">
                {completedTasks}/{totalTasks} completed • {inProgressTasks} in progress
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {progressPercentage}% Complete
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Next Priority Tasks */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-medium text-amber-800 mb-2">
                🎯 Next Priority Tasks (P0)
              </h3>
              {nextTasks.length > 0 ? (
                <div className="space-y-2">
                  {nextTasks.map(task => (
                    <div key={task.id} className="text-sm text-amber-700">
                      • {task.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-amber-700">All P0 tasks completed! 🎉</p>
              )}
            </div>

            {/* All Tasks */}
            <div className="grid gap-4">
              <h3 className="font-medium text-gray-900">All Tasks</h3>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border ${
                    task.status === 'in-progress' 
                      ? 'border-blue-200 bg-blue-50' 
                      : task.status === 'completed'
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-medium">{task.name}</h4>
                          {getPriorityBadge(task.priority)}
                          {getStatusBadge(task.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        {task.dependencies && (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                            <span className="text-xs text-amber-700">
                              Depends on: {task.dependencies.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueFlow2TaskTracker;
