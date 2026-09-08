
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Database, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseAnalysis {
  tables: Array<{ table_name: string; table_type: string }>;
  views: Array<{ table_name: string; table_schema: string }>;
  functions: Array<{ function_name: string; is_security_definer?: boolean; arguments?: string }>;
  triggers: unknown[];
  policies: Array<{ policyname: string; cmd: string; tablename: string; permissive: string }>;
  indexes: Array<{ index_name: string; table_name: string; index_definition: string }>;
  constraints: Array<{ constraint_name: string; constraint_type: string; table_name: string }>;
  duplicateIssues: string[];
  recommendations: string[];
}

export const DatabaseAnalysis = () => {
  const [analysis, setAnalysis] = useState<DatabaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('database-analysis');
      
      if (error) throw error;
      
      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "Database analysis has been completed successfully.",
      });
    } catch (error) {
      console.error('Error running database analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Structure Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your Supabase database to identify potential issues, duplicates, and optimization opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runAnalysis} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Run Database Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Issues Alert */}
          {analysis.duplicateIssues.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Potential Issues Found</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {analysis.duplicateIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Recommendations */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Analysis Summary</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="tables" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="tables">
                Tables <Badge variant="secondary" className="ml-1">{analysis.tables.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="views">
                Views <Badge variant="secondary" className="ml-1">{analysis.views.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="functions">
                Functions <Badge variant="secondary" className="ml-1">{analysis.functions.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="policies">
                Policies <Badge variant="secondary" className="ml-1">{analysis.policies.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="constraints">
                Constraints <Badge variant="secondary" className="ml-1">{analysis.constraints.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="indexes">
                Indexes <Badge variant="secondary" className="ml-1">{analysis.indexes.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tables" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Tables</CardTitle>
                  <CardDescription>All tables in the public schema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysis.tables.map((table, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-semibold">{table.table_name}</h4>
                        <p className="text-sm text-muted-foreground">Type: {table.table_type}</p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="views" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Views</CardTitle>
                  <CardDescription>All views in the public schema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysis.views.map((view, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-semibold">{view.table_name}</h4>
                        <p className="text-sm text-muted-foreground">Schema: {view.table_schema}</p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="functions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Functions</CardTitle>
                  <CardDescription>All custom functions in the public schema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.functions.map((func, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{func.function_name}</h4>
                          {func.is_security_definer && (
                            <Badge variant="outline">SECURITY DEFINER</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Arguments: {func.arguments || 'None'}
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>RLS Policies</CardTitle>
                  <CardDescription>Row Level Security policies by table</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.policies.map((policy, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{policy.policyname}</h4>
                          <Badge variant="outline">{policy.cmd}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Table: {policy.tablename}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Permissive: {policy.permissive}
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="constraints" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Table Constraints</CardTitle>
                  <CardDescription>Primary keys, foreign keys, and other constraints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.constraints.map((constraint, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{constraint.constraint_name}</h4>
                          <Badge variant="outline">{constraint.constraint_type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Table: {constraint.table_name}
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="indexes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Indexes</CardTitle>
                  <CardDescription>All indexes for performance optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.indexes.map((index, idx) => (
                      <Card key={idx} className="p-4">
                        <h4 className="font-semibold">{index.index_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Table: {index.table_name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-2">
                          {index.index_definition}
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default DatabaseAnalysis;
