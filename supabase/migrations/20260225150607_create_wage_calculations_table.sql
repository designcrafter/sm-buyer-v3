/*
  # Create wage_calculations table

  ## Summary
  Creates a table to store Living Wage Gap calculation records for each facility.
  This powers the Reports screen with aggregated wage gap data across all producers.

  ## New Tables
  - `wage_calculations`
    - `id` (uuid, primary key)
    - `buyer_id` (uuid, references auth.users) — the buyer who owns this data
    - `facility_name` (text) — display name of the facility
    - `facility_id` (text) — facility identifier code
    - `country` (text) — country of the facility
    - `year` (int) — payroll year of the calculation
    - `avg_wage_gap_pct` (numeric) — average wage gap as a percentage below living wage benchmark
    - `annual_facility_lwg_usd` (numeric) — total annual living wage gap in USD
    - `workers_below_lw_pct` (numeric) — percentage of workforce below living wage
    - `workers_below_lw_count` (int) — headcount below living wage
    - `total_workers` (int) — total workforce
    - `lw_benchmark_usd` (numeric) — living wage benchmark in USD per month
    - `status` (text) — Draft | Submitted | Completed | Archived
    - `gender_gap_pct` (numeric) — gender wage disparity percentage
    - `contributions_cash_usd` (numeric) — voluntary cash contributions
    - `contributions_vouchers_usd` (numeric) — voluntary voucher contributions
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Authenticated users can only read, insert, update, and delete their own records
*/

CREATE TABLE IF NOT EXISTS wage_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  facility_name text NOT NULL DEFAULT '',
  facility_id text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  year int NOT NULL DEFAULT 2024,
  avg_wage_gap_pct numeric NOT NULL DEFAULT 0,
  annual_facility_lwg_usd numeric NOT NULL DEFAULT 0,
  workers_below_lw_pct numeric NOT NULL DEFAULT 0,
  workers_below_lw_count int NOT NULL DEFAULT 0,
  total_workers int NOT NULL DEFAULT 0,
  lw_benchmark_usd numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft',
  gender_gap_pct numeric NOT NULL DEFAULT 0,
  contributions_cash_usd numeric NOT NULL DEFAULT 0,
  contributions_vouchers_usd numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wage_calculations_buyer_id_idx ON wage_calculations(buyer_id);
CREATE INDEX IF NOT EXISTS wage_calculations_country_idx ON wage_calculations(country);
CREATE INDEX IF NOT EXISTS wage_calculations_year_idx ON wage_calculations(year);

ALTER TABLE wage_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wage calculations"
  ON wage_calculations FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can insert own wage calculations"
  ON wage_calculations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update own wage calculations"
  ON wage_calculations FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can delete own wage calculations"
  ON wage_calculations FOR DELETE
  TO authenticated
  USING (auth.uid() = buyer_id);
