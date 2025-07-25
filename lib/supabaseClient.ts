import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// IMPORTANT: Replace with your Supabase project URL and anon key
// You can find these in your Supabase project settings -> API
const supabaseUrl = 'https://limgqjndsjuyorzpzsvq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbWdxam5kc2p1eW9yenB6c3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MDAzMzAsImV4cCI6MjA2ODk3NjMzMH0.WfAqtbXpy8_Z7fXfVVGIaR_4jpgjlcgtByqx783xaOk';

if (supabaseUrl.startsWith('[') || supabaseAnonKey.startsWith('[')) {
  const errorMessage = "Supabase configuration is missing. Please open 'lib/supabaseClient.ts' and replace the placeholder values for 'supabaseUrl' and 'supabaseAnonKey' with your actual Supabase project credentials. You can find these in your Supabase project dashboard under Settings > API.";
  
  // Log a detailed error to the console
  console.error("--- SUPABASE CONFIGURATION ERROR ---");
  console.error(errorMessage);
  console.error("------------------------------------");

  // Alert the user with a clear, actionable message
  alert(errorMessage);
  
  // Throw an error to halt execution. This is a critical failure.
  // The app cannot function without a database connection.
  throw new Error("Supabase not configured. See console for details.");
}


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);