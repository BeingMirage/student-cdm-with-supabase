const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL,
       process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
       const { data, error } = await supabase
              .from('diagnostic_reports')
              .select('mentor_name, average_rating, score_range, realism_rating, detailed_scores')
              .limit(1)
              .single();

       if (error) { console.error('Error:', error); return; }

       console.log('=== Top-level fields ===');
       console.log('mentor_name:', JSON.stringify(data.mentor_name));
       console.log('average_rating:', JSON.stringify(data.average_rating));
       console.log('realism_rating:', JSON.stringify(data.realism_rating));
       console.log('score_range:', JSON.stringify(data.score_range));

       console.log('\n=== All detailed_scores keys ===');
       const keys = Object.keys(data.detailed_scores || {});
       keys.forEach((k, i) => {
              console.log(`  [${i}] "${k}" => "${data.detailed_scores[k]}"`);
       });
}

check();
