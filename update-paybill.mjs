import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('Updating paybill to 247247 for all students...');

const { data: students, error: fetchError } = await supabase
  .from('students')
  .select('id, paybill');

if (fetchError) {
  console.error('Error fetching students:', fetchError);
  process.exit(1);
}

console.log(`Found ${students.length} students.`);

let updatedCount = 0;
for (const stu of students) {
  if (stu.paybill !== '247247') {
    const { error: updateError } = await supabase
      .from('students')
      .update({ paybill: '247247', updated_at: new Date().toISOString() })
      .eq('id', stu.id);
    if (updateError) {
      console.error(`Error updating student ${stu.id}:`, updateError);
      process.exit(1);
    }
    updatedCount++;
  }
}

console.log(`Updated paybill for ${updatedCount} students.`);
