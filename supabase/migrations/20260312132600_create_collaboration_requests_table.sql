/*
  # Create collaboration requests table

  Stores data access requests from buyers and intermediaries to suppliers,
  tracking what was requested, what was approved, and the current status.

  1. New Tables
    - `collaboration_requests`
      - `id` (uuid, primary key) - Unique request identifier
      - `supplier_id` (uuid, FK to auth.users) - The supplier who receives the request
      - `requester_id` (uuid, FK to auth.users) - The buyer or intermediary making the request
      - `requester_type` (text) - Either 'buyer' or 'intermediary'
      - `acting_on_behalf_of` (text, nullable) - Buyer name when requester is intermediary
      - `requested_payroll_years` (integer array) - Payroll years requested
      - `requested_duration` (text) - 'single' or 'ongoing'
      - `requested_audit_data` (boolean) - Whether audit data was requested
      - `requested_voluntary_contribution` (boolean) - Whether voluntary contribution data was requested
      - `approved_payroll_years` (integer array, nullable) - Payroll years the supplier approved
      - `approved_duration` (text, nullable) - Duration the supplier approved
      - `approved_audit_data` (boolean, nullable) - Whether supplier approved audit data sharing
      - `approved_voluntary_contribution` (boolean, nullable) - Whether supplier approved voluntary contribution sharing
      - `status` (text) - Current status: pending, approved, declined, or revoked
      - `decline_reason` (text, nullable) - Free-text reason when supplier declines
      - `requested_at` (timestamptz) - When the request was created
      - `responded_at` (timestamptz, nullable) - When the supplier responded
      - `revoked_at` (timestamptz, nullable) - When access was revoked

  2. Security
    - Enable RLS on `collaboration_requests` table
    - Suppliers can read requests addressed to them
    - Suppliers can update (respond to) requests addressed to them
    - Requesters can read their own outgoing requests
    - Requesters can insert new requests

  3. Indexes
    - Index on supplier_id for efficient lookup of incoming requests
    - Index on requester_id for efficient lookup of outgoing requests
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS collaboration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES auth.users(id),
  requester_id uuid NOT NULL REFERENCES auth.users(id),
  requester_type text NOT NULL DEFAULT 'buyer' CHECK (requester_type IN ('buyer', 'intermediary')),
  acting_on_behalf_of text,
  requested_payroll_years integer[] NOT NULL DEFAULT '{}',
  requested_duration text NOT NULL DEFAULT 'single' CHECK (requested_duration IN ('single', 'ongoing')),
  requested_audit_data boolean NOT NULL DEFAULT false,
  requested_voluntary_contribution boolean NOT NULL DEFAULT false,
  approved_payroll_years integer[],
  approved_duration text CHECK (approved_duration IS NULL OR approved_duration IN ('single', 'ongoing')),
  approved_audit_data boolean,
  approved_voluntary_contribution boolean,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'revoked')),
  decline_reason text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  revoked_at timestamptz
);

ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS collaboration_requests_supplier_id_idx ON collaboration_requests(supplier_id);
CREATE INDEX IF NOT EXISTS collaboration_requests_requester_id_idx ON collaboration_requests(requester_id);
CREATE INDEX IF NOT EXISTS collaboration_requests_status_idx ON collaboration_requests(status);

CREATE POLICY "Suppliers can view requests addressed to them"
  ON collaboration_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = supplier_id);

CREATE POLICY "Requesters can view their own outgoing requests"
  ON collaboration_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id);

CREATE POLICY "Requesters can create new requests"
  ON collaboration_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Suppliers can update requests addressed to them"
  ON collaboration_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = supplier_id)
  WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can delete requests addressed to them"
  ON collaboration_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = supplier_id);
