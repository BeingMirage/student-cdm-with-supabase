/**
 * Mentor Data Audit Script (READ-ONLY)
 * 
 * This script:
 * 1. Fetches all mentors referenced in cdm_journey_item_mentors (linked to cdm_learning_journey_items)
 * 2. Looks up each mentor in the mentors_new table (matching by email)
 * 3. Reports which fields are missing/empty for each mentor
 * 
 * NO CHANGES are made to the database.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL.trim(),
       process.env.SUPABASE_SERVICE_ROLE_KEY.trim()
);

// Fields we care about in mentors_new
const MENTORS_NEW_FIELDS = [
       'mentor_email',
       'mentor_phone',
       'mentor_profile_url',
       'mentor_first_name',
       'mentor_last_name',
       'mentor_address',
       'mentor_city',
       'mentor_pincode',
       'mentor_state',
       'mentor_country',
       'mentor_about',
       'mentor_education',
       'mentor_work_experience',
       'mentor_resume_url',
       'mentor_domain_expertise',
       'mentor_technical_skills',
       'mentor_soft_skills',
       'mentor_certification',
       'mentor_languages',
       'mentor_who_do_you',
       'mentor_prefer_mentoring',
       'mentor_area_interest',
       'mentor_weekly_time',
       'mentor_earnings',
       'mentor_linkedin_url',
       'mentor_other_profile_url',
       'mentor_account_holder_name',
       'mentor_bank_name',
       'mentor_average_rating',
       'mentor_threshold_rating',
       'mentor_account_no',
       'mentor_ifsc_code',
       'mentor_weekly_availability',
       'mentor_functional_domain_expertise',
       'mentor_pan_number',
       'experience_years',
       'username',
       'gd_session',
];

function isEmpty(value) {
       if (value === null || value === undefined) return true;
       if (typeof value === 'string' && value.trim() === '') return true;
       if (Array.isArray(value) && value.length === 0) return true;
       if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;
       return false;
}

async function main() {
       console.log('=== Mentor Data Audit Script (READ-ONLY) ===\n');

       // Step 1: Get all mentor assignments from cdm_journey_item_mentors + the journey item details
       console.log('Fetching journey item mentors...');
       const { data: itemMentors, error: itemMentorsErr } = await supabase
              .from('cdm_journey_item_mentors')
              .select('id, journey_item_id, mentor_id');

       if (itemMentorsErr) {
              console.error('Error fetching cdm_journey_item_mentors:', itemMentorsErr.message);
              return;
       }

       if (!itemMentors || itemMentors.length === 0) {
              console.log('No mentor assignments found in cdm_journey_item_mentors.');
              return;
       }

       console.log(`Found ${itemMentors.length} mentor assignment(s) in cdm_journey_item_mentors.\n`);

       // Step 2: Get unique mentor IDs (these reference the OLD mentors table)
       const uniqueMentorIds = [...new Set(itemMentors.map(im => im.mentor_id).filter(Boolean))];
       console.log(`Unique mentor IDs referenced: ${uniqueMentorIds.length}\n`);

       // Step 3: Fetch mentor details from the OLD mentors table to get their email
       console.log('Fetching mentor info from old "mentors" table...');
       const { data: oldMentors, error: oldMentorsErr } = await supabase
              .from('mentors')
              .select('id, first_name, last_name, email, phone')
              .in('id', uniqueMentorIds);

       if (oldMentorsErr) {
              console.error('Error fetching mentors table:', oldMentorsErr.message);
              return;
       }

       console.log(`Found ${(oldMentors || []).length} mentor(s) in old mentors table.\n`);

       // Build a map: old mentor id -> old mentor data
       const oldMentorMap = {};
       for (const m of (oldMentors || [])) {
              oldMentorMap[m.id] = m;
       }

       // Step 4: Try to find each mentor in mentors_new by email
       console.log('Cross-referencing with mentors_new table...\n');

       // Collect all emails to look up
       const emailsToLookup = (oldMentors || []).map(m => m.email).filter(Boolean);

       let mentorsNewMap = {};
       if (emailsToLookup.length > 0) {
              const { data: mentorsNew, error: mentorsNewErr } = await supabase
                     .from('mentors_new')
                     .select('*')
                     .in('mentor_email', emailsToLookup);

              if (mentorsNewErr) {
                     console.error('Error fetching mentors_new:', mentorsNewErr.message);
                     return;
              }

              for (const mn of (mentorsNew || [])) {
                     mentorsNewMap[mn.mentor_email] = mn;
              }
       }

       // Also try to find mentors_new records by matching the old mentor ID directly
       // (cdm_journey_item_mentors.mentor_id might also exist as mentors_new.id)
       const { data: mentorsNewById, error: mentorsNewByIdErr } = await supabase
              .from('mentors_new')
              .select('*')
              .in('id', uniqueMentorIds);

       if (!mentorsNewByIdErr && mentorsNewById) {
              for (const mn of mentorsNewById) {
                     if (!mentorsNewMap[mn.mentor_email]) {
                            mentorsNewMap[mn.mentor_email] = mn;
                     }
              }
       }

       // Step 5: Also get learning journey item details for context
       const uniqueJourneyItemIds = [...new Set(itemMentors.map(im => im.journey_item_id).filter(Boolean))];
       const { data: journeyItems, error: jiErr } = await supabase
              .from('cdm_learning_journey_items')
              .select('id, particulars, product_code, delivery_mode, format, status, start_date, end_date')
              .in('id', uniqueJourneyItemIds);

       const journeyItemMap = {};
       for (const ji of (journeyItems || [])) {
              journeyItemMap[ji.id] = ji;
       }

       // Step 6: Build the audit report
       console.log('========================================');
       console.log('       MENTOR DATA AUDIT REPORT');
       console.log('========================================\n');

       const auditResults = [];

       for (const mentorId of uniqueMentorIds) {
              const oldMentor = oldMentorMap[mentorId];
              const mentorName = oldMentor
                     ? `${oldMentor.first_name || ''} ${oldMentor.last_name || ''}`.trim() || 'N/A'
                     : 'NOT FOUND in old mentors table';
              const mentorEmail = oldMentor?.email || 'N/A';

              // Find in mentors_new
              let mentorNew = null;
              if (oldMentor?.email) {
                     mentorNew = mentorsNewMap[oldMentor.email];
              }
              // Also try by ID
              if (!mentorNew && mentorsNewById) {
                     mentorNew = mentorsNewById.find(mn => mn.id === mentorId);
              }

              // Find which journey items this mentor is assigned to
              const assignedItems = itemMentors
                     .filter(im => im.mentor_id === mentorId)
                     .map(im => {
                            const ji = journeyItemMap[im.journey_item_id];
                            return ji ? `${ji.particulars || ji.product_code || 'Unknown'} (${ji.status || 'N/A'})` : im.journey_item_id;
                     });

              // Determine missing fields
              const missingFields = [];
              const presentFields = [];

              if (!mentorNew) {
                     // Entire record missing in mentors_new
                     auditResults.push({
                            mentorId,
                            mentorName,
                            mentorEmail,
                            inMentorsNew: false,
                            assignedItems,
                            missingFields: ['ENTIRE RECORD MISSING IN mentors_new'],
                            presentFields: [],
                            missingCount: MENTORS_NEW_FIELDS.length,
                            totalFields: MENTORS_NEW_FIELDS.length,
                     });
              } else {
                     for (const field of MENTORS_NEW_FIELDS) {
                            if (isEmpty(mentorNew[field])) {
                                   missingFields.push(field);
                            } else {
                                   presentFields.push(field);
                            }
                     }

                     auditResults.push({
                            mentorId,
                            mentorName,
                            mentorEmail,
                            mentorNewEmail: mentorNew.mentor_email,
                            inMentorsNew: true,
                            assignedItems,
                            missingFields,
                            presentFields,
                            missingCount: missingFields.length,
                            totalFields: MENTORS_NEW_FIELDS.length,
                     });
              }
       }

       // Print summary table
       console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
       console.log('│                           SUMMARY TABLE                                     │');
       console.log('├──────────────────────────┬──────────────────────┬────────┬──────────────────┤');
       console.log('│ Mentor Name              │ Email                │ In New?│ Missing Fields   │');
       console.log('├──────────────────────────┼──────────────────────┼────────┼──────────────────┤');

       for (const r of auditResults) {
              const name = r.mentorName.substring(0, 24).padEnd(24);
              const email = (r.mentorEmail || '').substring(0, 20).padEnd(20);
              const inNew = r.inMentorsNew ? '  YES ' : '  NO  ';
              const missing = `${r.missingCount}/${r.totalFields}`.padEnd(16);
              console.log(`│ ${name} │ ${email} │${inNew}│ ${missing} │`);
       }

       console.log('└──────────────────────────┴──────────────────────┴────────┴──────────────────┘');

       // Print detailed report for each mentor
       console.log('\n\n========================================');
       console.log('       DETAILED REPORT PER MENTOR');
       console.log('========================================\n');

       for (const r of auditResults) {
              console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
              console.log(`Mentor: ${r.mentorName}`);
              console.log(`Old Mentor ID: ${r.mentorId}`);
              console.log(`Email: ${r.mentorEmail}`);
              console.log(`In mentors_new: ${r.inMentorsNew ? 'YES' : 'NO'}`);
              console.log(`Assigned Journey Items: ${r.assignedItems.join(', ') || 'None'}`);
              console.log(`Data Completeness: ${r.totalFields - r.missingCount}/${r.totalFields} fields filled`);

              if (r.missingCount > 0) {
                     console.log(`\n  ❌ MISSING FIELDS (${r.missingCount}):`);
                     for (const f of r.missingFields) {
                            console.log(`     - ${f}`);
                     }
              }

              if (r.presentFields && r.presentFields.length > 0) {
                     console.log(`\n  ✅ PRESENT FIELDS (${r.presentFields.length}):`);
                     for (const f of r.presentFields) {
                            console.log(`     - ${f}`);
                     }
              }
              console.log('');
       }

       // Print overall stats
       const totalMentors = auditResults.length;
       const notInNew = auditResults.filter(r => !r.inMentorsNew).length;
       const fullyComplete = auditResults.filter(r => r.missingCount === 0).length;
       const partiallyComplete = auditResults.filter(r => r.inMentorsNew && r.missingCount > 0).length;

       console.log('\n========================================');
       console.log('          OVERALL STATISTICS');
       console.log('========================================');
       console.log(`Total unique mentors in journey items:   ${totalMentors}`);
       console.log(`NOT found in mentors_new:                ${notInNew}`);
       console.log(`Found but with missing data:             ${partiallyComplete}`);
       console.log(`Fully complete profiles:                 ${fullyComplete}`);
       console.log('========================================\n');
}

main().catch(console.error);
