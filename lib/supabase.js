import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;
https://xxifoixbqmnzlefowywu.supabase.co

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aWZvaXhicW1uemxlZm93eXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTE2MjEsImV4cCI6MjA5Nzg4NzYyMX0.pd3aLew8LjxglU4-l3_xcRPHqz-qW0pxS0WJs2OJDwA

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing."
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
 
