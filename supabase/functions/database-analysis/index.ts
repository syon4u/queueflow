
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseAnalysis {
  tables: any[];
  views: any[];
  functions: any[];
  policies: any[];
  indexes: any[];
  constraints: any[];
  duplicateIssues: string[];
  recommendations: string[];
  summary: {
    totalTables: number;
    totalViews: number;
    totalFunctions: number;
    totalPolicies: number;
    totalConstraints: number;
    issuesFound: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const analysis: DatabaseAnalysis = {
      tables: [],
      views: [],
      functions: [],
      policies: [],
      indexes: [],
      constraints: [],
      duplicateIssues: [],
      recommendations: [],
      summary: {
        totalTables: 0,
        totalViews: 0,
        totalFunctions: 0,
        totalPolicies: 0,
        totalConstraints: 0,
        issuesFound: 0
      }
    }

    console.log('Starting comprehensive database analysis...')

    // Use direct SQL queries for better compatibility
    const executeQuery = async (query: string, description: string) => {
      try {
        const { data, error } = await supabaseClient.rpc('sql', { query });
        if (error) {
          console.error(`Error in ${description}:`, error);
          return [];
        }
        return Array.isArray(data) ? data : (data ? [data] : []);
      } catch (err) {
        console.error(`Exception in ${description}:`, err);
        return [];
      }
    };

    // 1. Get all tables in public schema
    analysis.tables = await executeQuery(`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `, 'tables query');

    // 2. Get all views
    analysis.views = await executeQuery(`
      SELECT 
        table_name as view_name,
        view_definition
      FROM information_schema.views 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `, 'views query');

    // 3. Get all functions
    analysis.functions = await executeQuery(`
      SELECT 
        routine_name as function_name,
        routine_type,
        security_type,
        routine_definition
      FROM information_schema.routines 
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      ORDER BY routine_name;
    `, 'functions query');

    // 4. Get RLS policies
    analysis.policies = await executeQuery(`
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `, 'policies query');

    // 5. Get constraints
    analysis.constraints = await executeQuery(`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        tc.constraint_type,
        string_agg(kcu.column_name, ', ') as columns
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_schema = 'public'
      GROUP BY tc.constraint_name, tc.table_name, tc.constraint_type
      ORDER BY tc.table_name, tc.constraint_type;
    `, 'constraints query');

    // 6. Get indexes
    analysis.indexes = await executeQuery(`
      SELECT 
        i.relname as index_name,
        t.relname as table_name,
        am.amname as index_type
      FROM pg_index ix
      JOIN pg_class i ON i.oid = ix.indexrelid
      JOIN pg_class t ON t.oid = ix.indrelid
      JOIN pg_am am ON i.relam = am.oid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE n.nspname = 'public'
      AND NOT ix.indisprimary
      ORDER BY t.relname, i.relname;
    `, 'indexes query');

    // Update summary
    analysis.summary = {
      totalTables: analysis.tables.length,
      totalViews: analysis.views.length,
      totalFunctions: analysis.functions.length,
      totalPolicies: analysis.policies.length,
      totalConstraints: analysis.constraints.length,
      issuesFound: 0
    };

    // 7. Analyze for potential issues
    console.log('Analyzing for potential issues...')
    
    // Check for tables without primary keys
    const primaryKeyTables = analysis.constraints
      .filter(c => c.constraint_type === 'PRIMARY KEY')
      .map(c => c.table_name);
    
    const tablesWithoutPK = analysis.tables
      .filter(t => !primaryKeyTables.includes(t.table_name))
      .map(t => t.table_name);
    
    if (tablesWithoutPK.length > 0) {
      analysis.duplicateIssues.push(`⚠️ Tables without primary keys: ${tablesWithoutPK.join(', ')}`);
    }

    // Check for excessive policies on user_roles (recursion risk)
    const userRolesPolicies = analysis.policies.filter(p => p.tablename === 'user_roles');
    if (userRolesPolicies.length > 5) {
      analysis.duplicateIssues.push(`⚠️ user_roles table has ${userRolesPolicies.length} policies - potential recursion risk`);
    }

    // Check for missing RLS on sensitive tables
    const sensitiveTableNames = ['user_roles', 'profiles', 'appointments', 'customers'];
    const tablesWithPolicies = [...new Set(analysis.policies.map(p => p.tablename))];
    const tablesWithoutRLS = sensitiveTableNames.filter(name => 
      analysis.tables.some(t => t.table_name === name) && !tablesWithPolicies.includes(name)
    );
    
    if (tablesWithoutRLS.length > 0) {
      analysis.duplicateIssues.push(`⚠️ Sensitive tables without RLS policies: ${tablesWithoutRLS.join(', ')}`);
    }

    // Check for duplicate function names
    const functionNames = analysis.functions.map(f => f.function_name.toLowerCase());
    const duplicateFunctions = functionNames.filter((name, index) => functionNames.indexOf(name) !== index);
    if (duplicateFunctions.length > 0) {
      analysis.duplicateIssues.push(`⚠️ Potential duplicate function names: ${[...new Set(duplicateFunctions)].join(', ')}`);
    }

    analysis.summary.issuesFound = analysis.duplicateIssues.length;

    // Generate recommendations
    if (analysis.summary.issuesFound === 0) {
      analysis.recommendations.push('✅ No critical issues detected in database structure');
    } else {
      analysis.recommendations.push(`🔍 Found ${analysis.summary.issuesFound} potential issues that need attention`);
    }

    analysis.recommendations.push(`📊 Database contains ${analysis.summary.totalTables} tables, ${analysis.summary.totalViews} views, ${analysis.summary.totalFunctions} functions`);
    
    const securityDefinerFunctions = analysis.functions.filter(f => f.security_type === 'DEFINER');
    analysis.recommendations.push(`🔒 ${securityDefinerFunctions.length} SECURITY DEFINER functions found (helps prevent RLS recursion)`);

    if (analysis.summary.totalPolicies > 0) {
      analysis.recommendations.push(`🛡️ ${analysis.summary.totalPolicies} RLS policies active across ${tablesWithPolicies.length} tables`);
    }

    console.log('Database analysis completed successfully');

    return new Response(
      JSON.stringify(analysis, null, 2),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Database analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to analyze database structure',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
