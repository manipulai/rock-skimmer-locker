import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndaucuzipatargfyyaod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kYXVjdXppcGF0YXJnZnl5YW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwODM2NjIsImV4cCI6MjA1NzY1OTY2Mn0.vcupUrx_ynXQS96_ERg-jC8uwylr3oyxjIbzUFgaqlU';

export const supabase = createClient(supabaseUrl, supabaseKey);