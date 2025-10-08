import { createClient } from '@supabase/supabase-js';


export const supabase = createClient( 
  'https://wdtpekjhvinqkmcplbzs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdHBla2podmlucWttY3BsYnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODY2MzEsImV4cCI6MjA3NDA2MjYzMX0.Q9ffgdf-ar1dlLZGkHRqMM88wxh_49AGdvIuuVTuk8Q'
);
