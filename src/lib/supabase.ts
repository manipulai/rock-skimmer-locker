import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables:',
    {
      url: supabaseUrl ? 'Present' : 'Missing',
      key: supabaseKey ? 'Present' : 'Missing'
    }
  );
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
// Test the connection
supabase.from('rocks').select('count', { count: 'exact' })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful');
    }
  })
  .catch(error => {
    console.error('Failed to connect to Supabase:', error);
  });
