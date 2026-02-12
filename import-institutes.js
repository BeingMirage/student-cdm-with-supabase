const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
require('dotenv').config({ path: '.env.local' });

// 1. Setup your credentials (Loaded from .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
       console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
       process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CSV_FILE = './Divegen - CDM Delivery view FY3 - Master Sheet.csv';

function normalizeDate(dateStr) {
       if (!dateStr) return null;
       let normalized = dateStr.trim();
       if (!normalized) return null;

       // 1. Try DD-MMM-YY (e.g., 22-Nov-25) - Common Excel format
       const ddMonYY = /^(\d{1,2})[-/]([a-zA-Z]{3})[-/](\d{2,4})$/;
       const match1 = normalized.match(ddMonYY);

       if (match1) {
              const dd = match1[1].padStart(2, '0');
              const mon = match1[2].toLowerCase();
              let yy = match1[3];
              if (yy.length === 2) yy = '20' + yy;

              const months = {
                     jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
                     jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
              };

              if (months[mon]) {
                     return `${yy}-${months[mon]}-${dd}`;
              }
       }

       // 2. Try DD/MM/YYYY or DD-MM-YYYY
       const ddmmyyyy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
       const match2 = normalized.match(ddmmyyyy);
       if (match2) {
              const dd = match2[1].padStart(2, '0');
              const mm = match2[2].padStart(2, '0');
              const yyyy = match2[3];
              return `${yyyy}-${mm}-${dd}`;
       }

       // 3. Fallback: Return raw string for "October Week 6" etc.
       return normalized;
}

async function importInstitutesAndParticulars() {
       try {
              console.log(`Reading ${CSV_FILE}...`);
              const fileContent = fs.readFileSync(CSV_FILE, 'utf8');

              const records = parse(fileContent, {
                     columns: true,
                     skip_empty_lines: true,
                     relax_column_count: true,
                     trim: true
              });

              console.log(`Parsed ${records.length} records.`);

              const instituteMap = new Map(); // Name -> ID
              let newInstituteCount = 0;
              let upsertedParticularCount = 0;

              for (const record of records) {
                     const instituteName = record['Institute Name']?.trim();
                     const particulars = record['Particulars']?.trim();
                     const startDateRaw = record['Start Date'];
                     const endDateRaw = record['End Date'];

                     if (!instituteName) continue;

                     let instituteId = instituteMap.get(instituteName);

                     // 1. Handle Institute
                     if (!instituteId) {
                            const { data: existingInstitute } = await supabase
                                   .from('institutes')
                                   .select('id')
                                   .eq('name', instituteName)
                                   .maybeSingle();

                            if (existingInstitute) {
                                   instituteId = existingInstitute.id;
                            } else {
                                   const { data: newInstitute, error: insertError } = await supabase
                                          .from('institutes')
                                          .insert({ name: instituteName })
                                          .select('id')
                                          .single();

                                   if (insertError) {
                                          if (insertError.code === '23505') { // Unique violation
                                                 const { data: retryInstitute } = await supabase
                                                        .from('institutes')
                                                        .select('id')
                                                        .eq('name', instituteName)
                                                        .single();
                                                 if (retryInstitute) instituteId = retryInstitute.id;
                                          } else {
                                                 console.error(`❌ Error creating institute ${instituteName}:`, insertError.message);
                                                 continue;
                                          }
                                   } else {
                                          instituteId = newInstitute.id;
                                          console.log(`   ✅ Created institute: ${instituteName}`);
                                          newInstituteCount++;
                                   }
                            }

                            if (instituteId) {
                                   instituteMap.set(instituteName, instituteId);
                            }
                     }

                     // 2. Handle Particulars with Dates
                     if (instituteId && particulars) {
                            const startDate = normalizeDate(startDateRaw);
                            const endDate = normalizeDate(endDateRaw);

                            // Upsert logic: check if exists, then update or insert
                            const { data: existingParticular } = await supabase
                                   .from('institute_particulars')
                                   .select('id')
                                   .eq('institute_id', instituteId)
                                   .eq('particulars', particulars)
                                   .maybeSingle();

                            if (existingParticular) {
                                   // Update dates
                                   const { error: updateError } = await supabase
                                          .from('institute_particulars')
                                          .update({
                                                 start_date: startDate,
                                                 end_date: endDate
                                          })
                                          .eq('id', existingParticular.id);

                                   if (updateError) {
                                          console.error(`❌ Error updating dates for "${particulars}" @ ${instituteName}:`, updateError.message);
                                   } else {
                                          // console.log(`   Updated dates for "${particulars}"`);
                                          upsertedParticularCount++;
                                   }
                            } else {
                                   // Insert new
                                   const { error: insertError } = await supabase
                                          .from('institute_particulars')
                                          .insert({
                                                 institute_id: instituteId,
                                                 particulars: particulars,
                                                 start_date: startDate,
                                                 end_date: endDate
                                          });

                                   if (insertError) {
                                          console.error(`❌ Error adding particular "${particulars}" to ${instituteName}:`, insertError.message);
                                   } else {
                                          // console.log(`   Added particular to ${instituteName}: ${particulars}`);
                                          upsertedParticularCount++;
                                   }
                            }
                     }
              }

              console.log(`\nImport complete.`);
              console.log(`New Institutes Created: ${newInstituteCount}`);
              console.log(`Particulars Processed (Upserted): ${upsertedParticularCount}`);

       } catch (err) {
              console.error('Unexpected error:', err);
       }
}

importInstitutesAndParticulars();
