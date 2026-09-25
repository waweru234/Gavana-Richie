import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const { data: students, error } = await supabase
  .from('students')
  .select('id, name, number, image')
  .limit(5);

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('First 5 students:');
students.forEach(s => {
  console.log(`ID: ${s.id}`);
  console.log(`Name: ${s.name}`);
  console.log(`Admission Number: ${s.number}`);
  console.log(`Image URL: ${s.image}`);
  console.log('---');
});
