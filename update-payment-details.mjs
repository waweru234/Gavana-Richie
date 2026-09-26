import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('Updating payment details for all students...');

const { data: students, error: fetchError } = await supabase
  .from('students')
  .select('id, account, need, paybill');

if (fetchError) {
  console.error('Error fetching students:', fetchError);
  process.exit(1);
}

console.log(`Found ${students.length} students.`);

let updatedCount = 0;
for (const stu of students) {
  const updates = {};
  let changed = false;

  // Update account to the provided account number
  if (stu.account !== '0310266154080') {
    updates.account = '0310266154080';
    changed = true;
  }

  // Update need to the school fees amount formatted as "KSh 14,500"
  const newNeed = 'KSh 14,500';
  if (stu.need !== newNeed) {
    updates.need = newNeed;
    changed = true;
  }

  // Ensure paybill is "247247" (should already be set, but double-check)
  if (stu.paybill !== '247247') {
    updates.paybill = '247247';
    changed = true;
  }

  if (changed) {
    updates.updated_at = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('students')
      .update(updates)
      .eq('id', stu.id);
    if (updateError) {
      console.error(`Error updating student ${stu.id}:`, updateError);
      process.exit(1);
    }
    updatedCount++;
    if (updatedCount % 10 === 0) {
      console.log(`Updated ${updatedCount} students...`);
    }
  }
}

console.log(`\nFinished. Updated payment details for ${updatedCount} students.`);
