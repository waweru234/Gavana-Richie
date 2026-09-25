const XLSX = require('xlsx');
const { createServerClient } = require('@supabase/supabase-js');

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createServerClient(supabaseUrl, supabaseAnonKey);

// Helper to convert Google Drive open link to direct download link
function getDirectImageUrl(viewUrl) {
  if (!viewUrl) return null;
  const match = viewUrl.match(/(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/open\?id=([^&]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  // If not a Google Drive open link, return as-is (could already be a direct link)
  return viewUrl;
}

// Read the Excel file
const workbook = XLSX.readFile('public/LIONHILL VOCATIONAl CENTRE  ADOPT-A-STUDENT.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_rows(worksheet);

// Build a map of admission number to direct image URL from the spreadsheet
const imageMap = new Map();
for (let i = 2; i < rows.length; i++) { // skip header row (index 0 is title?, index 1 is header)
  const row = rows[i];
  const admNumber = row[3] ? row[3].toString().trim() : ''; // ADM. NUMBER column (index 3)
  const photoUrl = row[6] ? row[6].toString().trim() : ''; // STUDENT PHOTO column (index 6)
  if (admNumber && photoUrl) {
    const directUrl = getDirectImageUrl(photoUrl);
    imageMap.set(admNumber, directUrl);
    console.log(`Row ${i}: ADM ${admNumber} -> ${directUrl}`);
  }
}

console.log(`Found ${imageMap.size} student image entries in spreadsheet.`);

// Fetch all students from the database
console.log('Fetching students from database...');
const { data: students, error: fetchError } = await supabase
  .from('students')
  .select('id, number, image');

if (fetchError) {
  console.error('Error fetching students:', fetchError);
  process.exit(1);
}

console.log(`Fetched ${students.length} students.`);

// Prepare updates
const updates = [];
for (const student of students) {
  const admNumber = student.number;
  if (admNumber && imageMap.has(admNumber)) {
    const newImage = imageMap.get(admNumber);
    // Only update if the image is different (or if current image is null)
    if (student.image !== newImage) {
      updates.push({
        id: student.id,
        image: newImage,
      });
      console.log(`Will update student ${admNumber} (ID: ${student.id}) image to: ${newImage}`);
    }
  }
}

if (updates.length === 0) {
  console.log('No updates needed.');
  process.exit(0);
}

// Apply updates in batches (to avoid hitting limits)
const batchSize = 50;
for (let i = 0; i < updates.length; i += batchSize) {
  const batch = updates.slice(i, i + batchSize);
  console.log(`Updating batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(updates.length / batchSize)}...`);
  const { error: updateError } = await supabase
    .from('students')
    .upsert(batch, { onConflict: ['id'] });
  if (updateError) {
    console.error('Error updating batch:', updateError);
    process.exit(1);
  }
  console.log(`Batch updated.`);
}

console.log('All updates completed successfully.');
