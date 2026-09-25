import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const admNumber = "1077";
const { data: students, error } = await supabase
  .from('students')
  .select('id, name, number, image')
  .eq('number', admNumber);

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

if (students.length === 0) {
  console.log(`No student found with number ${admNumber}`);
} else {
  const s = students[0];
  console.log(`Found student:`);
  console.log(`ID: ${s.id}`);
  console.log(`Name: ${s.name}`);
  console.log(`Admission Number: ${s.number}`);
  console.log(`Image URL: ${s.image}`);
}
