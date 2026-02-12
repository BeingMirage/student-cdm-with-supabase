const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

// 1. Setup your credentials (Loaded from .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
       console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
       process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const INSTITUTE_NAME = 'IIMK';
const CSV_FILE = './IIMK Student Data - Sheet1.csv';
const CHUNK_SIZE = 1000; // Supabase limit is usually 1000 per page

async function getAllUsers() {
       let allUsers = [];
       let page = 1;

       console.log("Fetching existing users...");

       while (true) {
              const { data: { users }, error } = await supabase.auth.admin.listUsers({
                     page: page,
                     perPage: CHUNK_SIZE
              });

              if (error) {
                     console.error("Error fetching users:", error.message);
                     throw error;
              }

              allUsers = allUsers.concat(users);

              if (users.length < CHUNK_SIZE) {
                     break;
              }
              page++;
       }

       console.log(`Found ${allUsers.length} existing users.`);
       return allUsers; // Return array of User objects
}


async function provisionStudents() {
       try {
              // Build map of Email -> UserID
              const users = await getAllUsers();
              const emailToIdMap = new Map();
              users.forEach(u => {
                     if (u.email) emailToIdMap.set(u.email.toLowerCase(), u.id);
              });

              // Read CSV
              const fileStream = fs.createReadStream(CSV_FILE);

              const rl = readline.createInterface({
                     input: fileStream,
                     crlfDelay: Infinity
              });

              let isHeader = true;
              let count = 0;
              let updatedCount = 0;
              let createdCount = 0;
              let errorCount = 0;

              console.log(`\nStarting import from ${CSV_FILE}...\n`);

              for await (const line of rl) {
                     if (isHeader) {
                            isHeader = false;
                            continue;
                     }

                     if (!line.trim()) continue;

                     // Columns: Full Name ,Email ID,Phone Number
                     const parts = line.split(',');
                     const fullName = parts[0]?.trim();
                     const rawEmail = parts[1]?.trim();
                     const phoneNumber = parts[2]?.trim();

                     if (!rawEmail || !phoneNumber) {
                            console.warn(`⚠️ Skipping line due to missing email or phone: ${line}`);
                            continue;
                     }

                     const email = rawEmail.toLowerCase();
                     const password = phoneNumber; // Phone number as password

                     // Determine if user exists
                     let userId = emailToIdMap.get(email);
                     let action = "";

                     if (userId) {
                            action = "UPDATE";
                            process.stdout.write(`Processing ${email} (UPDATE)... `);

                            // Update password and metadata
                            const { error: updateError } = await supabase.auth.admin.updateUserById(
                                   userId,
                                   {
                                          password: password,
                                          user_metadata: { full_name: fullName }
                                   }
                            );

                            if (updateError) {
                                   console.error(`❌ FAILS: ${updateError.message}`);
                                   errorCount++;
                                   continue;
                            } else {
                                   updatedCount++;
                            }

                     } else {
                            action = "CREATE";
                            process.stdout.write(`Processing ${email} (CREATE)... `);

                            const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
                                   email: email,
                                   password: password,
                                   email_confirm: true,
                                   user_metadata: { full_name: fullName }
                            });

                            if (createError) {
                                   console.error(`❌ FAIL: ${createError.message}`);
                                   errorCount++;
                                   continue;
                            } else {
                                   userId = authUser.user.id;
                                   createdCount++;
                            }
                     }

                     // Step B: Upsert Profile
                     if (userId) {
                            const { error: profileError } = await supabase
                                   .from('profiles')
                                   .upsert({
                                          id: userId,
                                          full_name: fullName,
                                          email: email,
                                          phone_number: phoneNumber,
                                          institute_name: INSTITUTE_NAME,
                                   }, { onConflict: 'id' });

                            if (profileError) {
                                   console.error(`❌ PROFILE ERROR: ${profileError.message}`);
                            } else {
                                   console.log(`✅ OK`);
                            }
                     }

                     count++;
              }

              console.log(`\nImport complete.`);
              console.log(`Processed: ${count}`);
              console.log(`Created: ${createdCount}`);
              console.log(`Updated: ${updatedCount}`);
              console.log(`Errors: ${errorCount}`);

       } catch (err) {
              console.error('Unexpected error:', err);
       }
}

provisionStudents();