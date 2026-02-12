const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
       console.error('❌ Error: Supabase credentials missing in .env.local');
       process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function importReports() {
       try {
              // 1. Load Name -> Email mapping from login-test.csv
              console.log('Reading login-test.csv...');
              const loginRaw = fs.readFileSync('./login-test.csv', 'utf8');

              // Handle potential BOM
              const loginData = loginRaw.replace(/^\uFEFF/, '');

              const loginMap = {};
              const loginRows = parse(loginData, {
                     columns: true,
                     skip_empty_lines: true,
                     trim: true
              });

              if (loginRows.length > 0) {
                     console.log('First login row keys:', Object.keys(loginRows[0]));
              }

              loginRows.forEach(row => {
                     // Log if we can't find expected columns
                     const name = row.name || row.Name || row.NAME;
                     const email = row.email || row.Email || row.EMAIL;

                     if (name && email) {
                            loginMap[name.trim().toLowerCase()] = email.trim().toLowerCase();
                     }
              });

              console.log('Login Map Size:', Object.keys(loginMap).length);
              console.log('Login Map Keys (first 5):', Object.keys(loginMap).slice(0, 5));

              // 2. Load all Profiles from Supabase to get Email -> ID mapping
              console.log('Fetching profiles from Supabase...');
              const { data: profiles, error: pError } = await supabase.from('profiles').select('id, email');
              if (pError) throw pError;

              const emailToIdMap = {};
              profiles.forEach(p => {
                     if (p.email) {
                            emailToIdMap[p.email.toLowerCase()] = p.id;
                     }
              });

              // 3. Parse the Diagnostic Interview CSV
              console.log('Parsing diagnostic interview CSV...');
              const reportRawData = fs.readFileSync('./IIMK-Diag-Int-1.csv', 'utf8')
                     .replace(/^\uFEFF/, ''); // Strip BOM

              const reports = parse(reportRawData, {
                     columns: true,
                     skip_empty_lines: true,
                     relax_column_count: true,
                     trim: true
              });

              console.log(`Found ${reports.length} report rows. Processing...`);

              // Helper: find a value from a row by partial key match (handles trailing spaces, BOM residue)
              function getVal(row, searchKey) {
                     const sk = searchKey.toLowerCase().trim();
                     for (const [k, v] of Object.entries(row)) {
                            if (k.toLowerCase().trim() === sk) return v;
                     }
                     return undefined;
              }

              // Fuzzy Match Function
              function findEmail(menteeName) {
                     const normalizedMentee = menteeName.toLowerCase().trim();
                     // 1. Direct match
                     if (loginMap[normalizedMentee]) return loginMap[normalizedMentee];

                     // 2. Word-based overlap match
                     const menteeWords = normalizedMentee.split(/\s+/).filter(w => w.length > 2);
                     for (const [name, email] of Object.entries(loginMap)) {
                            const nameWords = name.split(/\s+/).filter(w => w.length > 2);

                            const allLoginInMentee = nameWords.length > 0 && nameWords.every(w => normalizedMentee.includes(w));
                            const allMenteeInLogin = menteeWords.length > 0 && menteeWords.every(w => name.includes(w));

                            if (allLoginInMentee || allMenteeInLogin) {
                                   return email;
                            }
                     }
                     return null;
              }

              // 4. Delete old data before re-importing
              console.log('Deleting old diagnostic reports...');
              const { error: delError } = await supabase
                     .from('diagnostic_reports')
                     .delete()
                     .neq('student_id', '00000000-0000-0000-0000-000000000000'); // delete all rows
              if (delError) {
                     console.error('❌ Error deleting old reports:', delError.message);
              } else {
                     console.log('✅ Old reports cleared.');
              }

              // 5. Import fresh
              for (const row of reports) {
                     const menteeNameRaw = getVal(row, 'Mentee Name');
                     if (!menteeNameRaw) continue;
                     const menteeName = menteeNameRaw.trim();

                     const email = findEmail(menteeName);
                     if (!email) {
                            continue;
                     }

                     const studentId = emailToIdMap[email];
                     if (!studentId) {
                            continue;
                     }

                     // Normalize detailed_scores keys: strip BOM, trim whitespace
                     const cleanScores = {};
                     for (const [k, v] of Object.entries(row)) {
                            const cleanKey = k.replace(/^\uFEFF/, '').trim();
                            if (cleanKey) cleanScores[cleanKey] = typeof v === 'string' ? v.trim() : v;
                     }

                     // Map CSV columns to Database columns
                     const reportData = {
                            student_id: studentId,
                            mentor_name: (getVal(row, 'Mentor Name') || '').trim() || null,
                            improvement_areas: (getVal(row, 'Where do you believe improvements are needed? Summary of Candidate - areas where he need to work on?') || '').trim() || null,
                            targeted_roles: (getVal(row, 'What are the top 2–3 roles the student is currently targeting? What reasons has the student shared for their role preferences?') || '').trim() || null,
                            score_range: (getVal(row, 'Range') || '').trim() || null,
                            average_rating: parseFloat(getVal(row, 'Average Rating')) || null,
                            realism_rating: parseFloat(getVal(row, 'On a scale of 1–5, how realistic and aligned are these preferences with their background?')) || null,
                            strongest_aspects: (getVal(row, 'What are the strongest aspects of the candidate?') || '').trim() || null,
                            fit_job_families: (getVal(row, 'Based on your assessment, which 2–3 job families would the student fit best in?') || '').trim() || null,
                            backup_roles: (getVal(row, 'What could be their Plan B and Plan C roles?') || '').trim() || null,
                            detailed_scores: cleanScores
                     };

                     const { error: insertError } = await supabase
                            .from('diagnostic_reports')
                            .insert(reportData);

                     if (insertError) {
                            console.error(`❌ Error inserting report for ${menteeName}:`, insertError.message);
                     } else {
                            console.log(`✅ Imported report for: ${menteeName}`);
                     }
              }

              console.log('All done!');
       } catch (err) {
              console.error('❌ Critical Error:', err);
       }
}

importReports()
       .then(() => {
              console.log('Script finished successfully');
              process.exit(0);
       })
       .catch(err => {
              console.error('Script failed with error:', err);
              process.exit(1);
       });
