import XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to map name to filename based on user's provided list
const nameToFilename = {
  "Paul Kamau": "33_084858 - Paul Kamau.jpg",
  "Muriuki Peter": "file_0000000085ac8208a8728945ce503aee - Muriuki Peter.png",
  "Billy Cantoz": "IMG_20260903_133630 - Billy Cantoz.jpg",
  "Timo Njosh": "IMG_20260917_143447 - Timo Njosh.jpg",
  "Nelly's Njoki Kangoro": "IMG-20260918-WA0000 - Nellys kangoro.jpg",
  "Stephen Mungai Karanja": "file_00000000ced08208ade9fb5c7c808e2c - Sparta Kelme.png",
  "Rey Morgan Muchiri": "file_00000000f964821181fa86c3bfe7b608 - Sparta Kelme.png",
};

// Read the Excel file
const workbook = XLSX.readFile("public/LIONHILL VOCATIONAl CENTRE  ADOPT-A-STUDENT.xlsx");
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
// Get rows as array of arrays (each inner array is a row)
const rows = XLSX.utils.sheet_to_json(worksheet, { header: false, defval: "" });

console.log(`Total rows: ${rows.length}`);

// Skip first two rows: row 0 = title, row 1 = header
const admNumberToName = new Map();
for (let i = 2; i < rows.length; i++) {
  const row = rows[i];
  const admNumber = row[3] ? String(row[3]).trim() : ""; // ADM. NUMBER column index 3
  const fullName = row[1] ? String(row[1]).trim() : ""; // FULL NAME column index 1
  if (admNumber && fullName) {
    admNumberToName.set(admNumber, fullName);
  }
}

console.log(`Loaded ${admNumberToName.size} student records from spreadsheet.`);

// Fetch all students from the database
console.log("Fetching students from database...");
const { data: students, error: fetchError } = await supabase
  .from("students")
  .select("id, name, number");

if (fetchError) {
  console.error("Error fetching students:", fetchError);
  process.exit(1);
}

console.log(`Fetched ${students.length} students.`);

// Prepare updates
const updates = [];
for (const student of students) {
  const admNumber = student.number;
  const nameFromDb = student.name;
  const spreadsheetName = admNumberToName.get(admNumber);
  if (!spreadsheetName) {
    // If not found in spreadsheet, try to match by name directly? Not needed.
    continue;
  }
  const filename = nameToFilename[spreadsheetName];
  if (filename) {
    const imagePath = `/students/${filename}`; // local path in public folder
    if (student.image !== imagePath) {
      updates.push({
        id: student.id,
        image: imagePath,
      });
      console.log(`Will update student ${admNumber} (${spreadsheetName}) image to: ${imagePath}`);
    }
  }
}

if (updates.length === 0) {
  console.log("No updates needed.");
  process.exit(0);
}

// Apply updates individually
console.log(`Applying ${updates.length} updates...`);
for (const { id, image } of updates) {
  const { error: updateError } = await supabase
    .from("students")
    .update({ image })
    .eq("id", id);
  if (updateError) {
    console.error(`Error updating student ID ${id}:`, updateError);
    process.exit(1);
  }
  if (updates.indexOf({ id, image }) % 10 === 0) {
    console.log(`Processed ${updates.indexOf({ id, image }) + 1}/${updates.length} updates`);
  }
}

console.log("All updates completed successfully.");
