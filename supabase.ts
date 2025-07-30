import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://aregapzwjlajdlskvcdr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZWdhcHp3amxhamRsc2t2Y2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDM3NTIsImV4cCI6MjA2OTQ3OTc1Mn0.74bSuifFFLqvVJJVVA4v1eaRcFolNfmZAm7wkwWbwu0'
);
