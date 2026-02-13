-- ============================================================================
-- Role-Based Access Control (RBAC) Setup for Jhansel Cement Pots
-- ============================================================================
-- This SQL script sets up a user_roles table and Row Level Security (RLS)
-- policies to implement proper role-based access control.
--
-- IMPORTANT: Run this script in your Supabase SQL Editor to set up RBAC.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Step 1: Create the user_roles table
-- ----------------------------------------------------------------------------
-- This table stores the role for each user in the system.
-- Roles: 'admin' - Full access to admin dashboard and all operations
--        'user'  - Regular user with limited access
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Add comment to table
COMMENT ON TABLE user_roles IS 'Stores user roles for RBAC. Roles: admin, user';

-- ----------------------------------------------------------------------------
-- Step 2: Enable Row Level Security (RLS) on user_roles table
-- ----------------------------------------------------------------------------

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Step 3: Create RLS policies for user_roles table
-- ----------------------------------------------------------------------------

-- Policy: Users can read their own role
CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can read all roles (for admin operations)
CREATE POLICY "Service role can read all roles"
  ON user_roles FOR SELECT
  USING (
    -- This policy is checked by Supabase internally for service role
    -- No additional check needed as service role bypasses RLS
    true
  );

-- Policy: Service role can insert roles (for user creation)
CREATE POLICY "Service role can insert roles"
  ON user_roles FOR INSERT
  WITH CHECK (true);

-- Policy: Service role can update roles (for role changes)
CREATE POLICY "Service role can update roles"
  ON user_roles FOR UPDATE
  USING (true);

-- Policy: Service role can delete roles (for user deletion)
CREATE POLICY "Service role can delete roles"
  ON user_roles FOR DELETE
  USING (true);

-- ----------------------------------------------------------------------------
-- Step 4: Create a function to check if a user has a specific role
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION has_role(user_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role = user_role
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION has_role(TEXT) TO authenticated;

-- ----------------------------------------------------------------------------
-- Step 5: Create a function to get the current user's role
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;

-- ----------------------------------------------------------------------------
-- Step 6: Update products table RLS policies to use RBAC
-- ----------------------------------------------------------------------------

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Authenticated can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated can update products" ON products;
DROP POLICY IF EXISTS "Authenticated can delete products" ON products;

-- Create new RBAC-based policies

-- Policy: Public (including unauthenticated) can view products
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  USING (true);

-- Policy: Only admins can insert products
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (has_role('admin'));

-- Policy: Only admins can update products
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (has_role('admin'));

-- Policy: Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (has_role('admin'));

-- ----------------------------------------------------------------------------
-- Step 7: Update contact_messages table RLS policies to use RBAC
-- ----------------------------------------------------------------------------

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can delete contact messages" ON contact_messages;

-- Create new RBAC-based policies

-- Policy: Public can insert contact messages
CREATE POLICY "Public can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view all contact messages
CREATE POLICY "Admins can view all contact messages"
  ON contact_messages FOR SELECT
  USING (has_role('admin'));

-- Policy: Only admins can update contact messages
CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  USING (has_role('admin'));

-- Policy: Only admins can delete contact messages
CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  USING (has_role('admin'));

-- ----------------------------------------------------------------------------
-- Step 8: Create a trigger to update the updated_at timestamp
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply trigger to user_roles table
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- Step 9: Create initial admin user (optional)
-- ----------------------------------------------------------------------------
-- Uncomment and modify the email below to create an initial admin user
-- You'll need to set the user_id to match an existing user in auth.users

-- INSERT INTO user_roles (user_id, role)
-- VALUES (
--   'YOUR_USER_ID_HERE', -- Replace with actual user UUID from auth.users
--   'admin'
-- );

-- ----------------------------------------------------------------------------
-- Step 10: Create a helper function to assign a role to a user
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION assign_user_role(target_user_id UUID, new_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Check if the current user is an admin
  SELECT role INTO current_user_role
  FROM user_roles
  WHERE user_id = auth.uid();
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  
  -- Validate the role
  IF new_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Invalid role. Must be "admin" or "user"';
  END IF;
  
  -- Insert or update the user's role
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id)
  DO UPDATE SET role = new_role, updated_at = NOW();
  
  RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION assign_user_role(UUID, TEXT) TO authenticated;

-- ============================================================================
-- Setup Complete!
-- ============================================================================
--
-- Next Steps:
--
-- 1. Run this script in your Supabase SQL Editor
-- 2. Find your user_id by running: SELECT id, email FROM auth.users;
-- 3. Assign yourself as admin by running:
--    INSERT INTO user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'admin');
--
-- 4. Update your frontend code to check user roles before allowing admin access
-- 5. Test the RBAC policies by trying to access admin features with different roles
--
-- ============================================================================
