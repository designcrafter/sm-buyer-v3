/*
  # Create producers table

  ## Summary
  Creates a table to store producer (input facility) records added by buyers.

  ## New Tables
  - `producers`
    - `id` (uuid, primary key)
    - `buyer_id` (uuid, references auth.users) — the buyer who added this producer
    - `facility_id` (text, not null) — the facility identifier
    - `email` (text, not null) — contact email for the facility
    - `created_at` (timestamptz) — when the record was added

  ## Security
  - RLS enabled
  - Authenticated users can only insert and read their own producers
*/

CREATE TABLE IF NOT EXISTS producers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  facility_id text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS producers_buyer_id_idx ON producers(buyer_id);

ALTER TABLE producers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own producers"
  ON producers FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can insert own producers"
  ON producers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can delete own producers"
  ON producers FOR DELETE
  TO authenticated
  USING (auth.uid() = buyer_id);
