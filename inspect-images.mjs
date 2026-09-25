import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const { data: students, error } = await supabase
  .from("students")
  .select("id, name, number, image");

if (error) {
  console.error("Error:", error);
  process.exit(1);
}

students.forEach(s => {
  const img = s.image || "";
  const preview = img.length > 60 ? img.substring(0, 60) + "..." : img;
  console.log(`${s.number} ${s.name}: ${preview}`);
});
