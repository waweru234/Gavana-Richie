-- SQL for creating the join_requests table in Supabase
-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  message TEXT,
  created_at TIMESTAMPTZ WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert from all (anon and authenticated)
-- Adjust as needed for your security requirements.
CREATE POLICY "Allow insert for all"
  ON join_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Optional: Allow select for authenticated users only (if you want to view in dashboard via auth)
CREATE POLICY "Allow select for authenticated"
  ON join_requests
  FOR SELECT
  TO authenticated
  USING (true);