/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function check() {
       const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
       let output = '';

       const tables = ['cdm_students', 'students', 'students_new'];
       for (const table of tables) {
              const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
              if (error) {
                     output += `Table ${table}: Error or Not Found\n`;
              } else {
                     output += `Table ${table}: ${count} rows\n`;
              }
       }
       fs.writeFileSync('counts.txt', output);
       console.log('Done');
}
check();

