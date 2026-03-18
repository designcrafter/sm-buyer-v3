/*
  # Add supplier-buyer junction table for many-to-many relationships

  1. New Tables
    - `supplier_buyers`
      - `id` (uuid, primary key)
      - `supplier_id` (uuid, foreign key to suppliers table)
      - `buyer_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `created_by_intermediary_id` (uuid, nullable, foreign key to auth.users)
      - Unique constraint on (supplier_id, buyer_id) to prevent duplicates

  2. Changes
    - This enables many-to-many relationships between suppliers and buyers
    - Allows intermediaries to match the same producer to multiple buyers
    - Tracks which intermediary created each supplier-buyer relationship

  3. Security
    - Enable RLS on `supplier_buyers` table
    - Add policy for authenticated users to read their related supplier-buyer relationships
    - Add policy for authenticated users to insert new supplier-buyer relationships
*/

CREATE TABLE IF NOT EXISTS supplier_buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  created_by_intermediary_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(supplier_id, buyer_id)
);

ALTER TABLE supplier_buyers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their related supplier-buyer relationships"
  ON supplier_buyers FOR SELECT
  TO authenticated
  USING (
    auth.uid() = buyer_id 
    OR auth.uid() = supplier_id 
    OR auth.uid() = created_by_intermediary_id
  );

CREATE POLICY "Authenticated users can create supplier-buyer relationships"
  ON supplier_buyers FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by_intermediary_id 
    OR auth.uid() = buyer_id
  );

CREATE INDEX IF NOT EXISTS idx_supplier_buyers_supplier_id ON supplier_buyers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_buyers_buyer_id ON supplier_buyers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_supplier_buyers_intermediary_id ON supplier_buyers(created_by_intermediary_id);
