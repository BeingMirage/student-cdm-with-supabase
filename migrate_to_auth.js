const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
       const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
       const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

       if (!supabaseUrl || !supabaseServiceKey) {
              console.error('Missing Supabase credentials in .env.local');
              return;
       }

       const supabase = createClient(supabaseUrl, supabaseServiceKey, {
              auth: {
                     autoRefreshToken: false,
                     persistSession: false
              }
       });

       console.log('Fetching students from cdm_students...');
       const { data: students, error: fetchError } = await supabase
              .from('cdm_students')
              .select('email, phone, full_name');

       if (fetchError) {
              console.error('Error fetching students:', fetchError);
              return;
       }

       console.log(`Found ${students.length} students. Starting migration to Supabase Auth...`);

       let successCount = 0;
       let existCount = 0;
       let errorCount = 0;

       for (const student of students) {
              if (!student.email) {
                     console.warn(`Skipping student with no email: ${student.full_name}`);
                     continue;
              }

              // We use the phone number as the temporary password if it exists
              // Otherwise, we use a generic placeholder
              const password = student.phone || 'Welcome@123';

              const { data: user, error: createError } = await supabase.auth.admin.createUser({
                     id: student.id,
                     email: student.email,
                     password: password,
                     email_confirm: true,
                     user_metadata: { full_name: student.full_name }
              });

              if (createError) {
                     if (createError.message.includes('already registered')) {
                            console.log(`[EXIST] ${student.email} is already in Auth.`);
                            existCount++;
                     } else {
                            console.error(`[ERROR] Failed to create ${student.email}:`, createError.message);
                            errorCount++;
                     }
              } else {
                     console.log(`[SUCCESS] Created Auth user for ${student.email}`);
                     successCount++;
              }
       }

       console.log('\nMigration Summary:');
       console.log('-------------------');
       console.log(`Successfully created: ${successCount}`);
       console.log(`Already registered:   ${existCount}`);
       console.log(`Failed:                ${errorCount}`);
       console.log('-------------------');
}

migrate();
