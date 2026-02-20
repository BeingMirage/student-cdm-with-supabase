/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('Key defined:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listStudents() {
       console.log('Attempting to fetch students from cdm_students...');
       try {
              const { data, error } = await supabase
                     .from('cdm_students')
                     .select('id, email, full_name, phone')
                     .limit(10);

              if (error) {
                     console.error('Error fetching students:', error);
                     return;
              }

              console.log('Sample students count:', data?.length || 0);
              console.log('Sample students data:');
              console.log(JSON.stringify(data, null, 2));

              const { count, error: countError } = await supabase
                     .from('cdm_students')
                     .select('*', { count: 'exact', head: true });

              if (countError) {
                     console.error('Error counting students:', countError);
              } else {
                     console.log('Total students in DB:', count);
              }
       } catch (err) {
              console.error('Captured error:', err);
       }
}

listStudents();

