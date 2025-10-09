import { createClient } from '@supabase/supabase-js';


export const supabase = createClient( 
  'https://akissuihdufeeehbaxqs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraXNzdWloZHVmZWVlaGJheHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTk5NjMsImV4cCI6MjA3NTU3NTk2M30.Ce7UIFwqA-0mcNcMyvG95aGgzBezhMA4H61LhdAq8YI'
);
