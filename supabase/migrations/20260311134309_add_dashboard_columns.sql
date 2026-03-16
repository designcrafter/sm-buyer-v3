/*
  # Add dashboard analytics columns to wage_calculations

  1. New Columns on `wage_calculations`
    - `region` (text) - Sub-national region of the facility (e.g., "Red River Delta", "Maharashtra")
    - `lw_estimate_usd` (numeric) - Living Wage Estimate in USD, replacing the old "benchmark" terminology per ILO alignment
    - `workers_above_lw_women` (integer) - Number of female workers earning at or above a living wage
    - `workers_below_lw_women` (integer) - Number of female workers earning below a living wage
    - `workers_above_lw_men` (integer) - Number of male workers earning at or above a living wage
    - `workers_below_lw_men` (integer) - Number of male workers earning below a living wage
    - `base_wage_pct` (numeric) - Percentage of total remuneration from base wage
    - `bonuses_pct` (numeric) - Percentage of total remuneration from bonuses
    - `in_kind_pct` (numeric) - Percentage of total remuneration from in-kind benefits
    - `overtime_pay_pct` (numeric) - Percentage of total remuneration from overtime pay
    - `regular_hours_women` (numeric) - Average monthly regular hours for female workers
    - `overtime_hours_women` (numeric) - Average monthly overtime hours for female workers
    - `regular_hours_men` (numeric) - Average monthly regular hours for male workers
    - `overtime_hours_men` (numeric) - Average monthly overtime hours for male workers

  2. Notes
    - All new columns use safe defaults (empty string for text, 0 for numeric/integer)
    - No data is dropped or modified; this is purely additive
    - The old `lw_benchmark_usd` column is preserved for backwards compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'region'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN region text DEFAULT '' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'lw_estimate_usd'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN lw_estimate_usd numeric DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'workers_above_lw_women'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN workers_above_lw_women integer DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'workers_below_lw_women'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN workers_below_lw_women integer DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'workers_above_lw_men'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN workers_above_lw_men integer DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'workers_below_lw_men'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN workers_below_lw_men integer DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'base_wage_pct'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN base_wage_pct numeric DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'bonuses_pct'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN bonuses_pct numeric DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'in_kind_pct'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN in_kind_pct numeric DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'overtime_pay_pct'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN overtime_pay_pct numeric DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'regular_hours_women'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN regular_hours_women numeric DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'overtime_hours_women'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN overtime_hours_women numeric DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'regular_hours_men'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN regular_hours_men numeric DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wage_calculations' AND column_name = 'overtime_hours_men'
  ) THEN
    ALTER TABLE wage_calculations ADD COLUMN overtime_hours_men numeric DEFAULT 0 NOT NULL;
  END IF;
END $$;
