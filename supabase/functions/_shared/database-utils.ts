
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const executeRawSQL = async (supabaseClient: any, query: string) => {
  try {
    const { data, error } = await supabaseClient.rpc('exec_sql', {
      query: query
    });
    
    if (error) {
      console.error('SQL execution error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Raw SQL execution failed:', err);
    return { data: null, error: err };
  }
};

export const analyzeTableStructure = async (supabaseClient: any) => {
  const queries = {
    tables: `
      SELECT 
        table_name,
        table_type,
        is_insertable_into,
        is_typed
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `,
    
    columns: `
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `,
    
    constraints: `
      SELECT 
        tc.constraint_name,
        tc.table_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_type;
    `
  };

  const results: any = {};
  
  for (const [key, query] of Object.entries(queries)) {
    const { data, error } = await executeRawSQL(supabaseClient, query);
    if (!error) {
      results[key] = data;
    } else {
      console.error(`Error executing ${key} query:`, error);
      results[key] = [];
    }
  }
  
  return results;
};
