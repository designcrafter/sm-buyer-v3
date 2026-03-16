/*
  # Rename producers table to suppliers

  ## Summary
  Renames the `producers` table to `suppliers` to use more accurate terminology.
  This migration maintains all existing data, relationships, indexes, and RLS policies.

  ## Changes
  - Rename table `producers` to `suppliers`
  - Rename index `producers_buyer_id_idx` to `suppliers_buyer_id_idx`
  - Rename RLS policies to reference suppliers instead of producers

  ## Security
  - All existing RLS policies are maintained with updated names
  - No changes to access control logic
*/

-- Rename the table
ALTER TABLE IF EXISTS producers RENAME TO suppliers;

-- Rename the index
ALTER INDEX IF EXISTS producers_buyer_id_idx RENAME TO suppliers_buyer_id_idx;

-- Drop old policies (they're attached to the table, so they'll be renamed automatically)
-- But we'll recreate them with clearer names
DROP POLICY IF EXISTS "Users can read own producers" ON suppliers;
DROP POLICY IF EXISTS "Users can insert own producers" ON suppliers;
DROP POLICY IF EXISTS "Users can delete own producers" ON suppliers;

-- Create policies with updated names
CREATE POLICY "Users can read own suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can insert own suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can delete own suppliers"
  ON suppliers FOR DELETE
  TO authenticated
  USING (auth.uid() = buyer_id);