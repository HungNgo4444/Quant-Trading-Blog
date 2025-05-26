-- 🔧 FIX RLS POLICIES FOR QUANTITATIVE TRADING BLOG
-- This script fixes Row Level Security policies that are blocking operations

-- ========================================
-- 1. DISABLE RLS TEMPORARILY FOR TESTING
-- ========================================

-- Disable RLS on all tables to test if this is the issue
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_settings DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. DROP EXISTING RESTRICTIVE POLICIES
-- ========================================

-- Drop all existing policies that might be too restrictive
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can update their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON blog_posts;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

DROP POLICY IF EXISTS "Post interactions are viewable by everyone" ON post_interactions;
DROP POLICY IF EXISTS "Authenticated users can insert interactions" ON post_interactions;
DROP POLICY IF EXISTS "Users can delete their own interactions" ON post_interactions;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Blog settings are viewable by everyone" ON blog_settings;
DROP POLICY IF EXISTS "Only admins can insert blog settings" ON blog_settings;
DROP POLICY IF EXISTS "Only admins can update blog settings" ON blog_settings;

-- ========================================
-- 3. CREATE PERMISSIVE POLICIES
-- ========================================

-- Re-enable RLS with more permissive policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_settings ENABLE ROW LEVEL SECURITY;

-- BLOG_POSTS: Allow all operations for authenticated users
CREATE POLICY "Allow all operations on blog_posts for authenticated users"
ON blog_posts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- BLOG_POSTS: Allow read for anonymous users
CREATE POLICY "Allow read on blog_posts for anonymous users"
ON blog_posts FOR SELECT
TO anon
USING (true);

-- COMMENTS: Allow all operations for authenticated users
CREATE POLICY "Allow all operations on comments for authenticated users"
ON comments FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- COMMENTS: Allow read for anonymous users
CREATE POLICY "Allow read on comments for anonymous users"
ON comments FOR SELECT
TO anon
USING (true);

-- POST_INTERACTIONS: Allow all operations for authenticated users
CREATE POLICY "Allow all operations on post_interactions for authenticated users"
ON post_interactions FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- POST_INTERACTIONS: Allow read for anonymous users
CREATE POLICY "Allow read on post_interactions for anonymous users"
ON post_interactions FOR SELECT
TO anon
USING (true);

-- PROFILES: Allow all operations for authenticated users
CREATE POLICY "Allow all operations on profiles for authenticated users"
ON profiles FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- PROFILES: Allow read for anonymous users
CREATE POLICY "Allow read on profiles for anonymous users"
ON profiles FOR SELECT
TO anon
USING (true);

-- BLOG_SETTINGS: Allow all operations for authenticated users
CREATE POLICY "Allow all operations on blog_settings for authenticated users"
ON blog_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- BLOG_SETTINGS: Allow read for anonymous users
CREATE POLICY "Allow read on blog_settings for anonymous users"
ON blog_settings FOR SELECT
TO anon
USING (true);

-- ========================================
-- 4. GRANT NECESSARY PERMISSIONS
-- ========================================

-- Grant permissions to authenticated role
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON comments TO authenticated;
GRANT ALL ON post_interactions TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON blog_settings TO authenticated;

-- Grant read permissions to anonymous role
GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON comments TO anon;
GRANT SELECT ON post_interactions TO anon;
GRANT SELECT ON profiles TO anon;
GRANT SELECT ON blog_settings TO anon;

-- ========================================
-- 5. ENSURE ADMIN USER EXISTS AND HAS PROPER ROLE
-- ========================================

-- Create or update admin user profile
INSERT INTO profiles (id, email, name, role, is_email_verified, created_at, last_login_at)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Fixed UUID for admin
  'admin@quantblog.com',
  'Quant Admin',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_email_verified = true,
  last_login_at = NOW();

-- ========================================
-- 6. TEST QUERIES
-- ========================================

-- Test if we can now perform operations
SELECT 'Testing blog_posts read...' as test;
SELECT COUNT(*) as post_count FROM blog_posts;

SELECT 'Testing comments read...' as test;
SELECT COUNT(*) as comment_count FROM comments;

SELECT 'Testing post_interactions read...' as test;
SELECT COUNT(*) as interaction_count FROM post_interactions;

SELECT 'Testing profiles read...' as test;
SELECT COUNT(*) as profile_count FROM profiles;

SELECT 'Admin user check...' as test;
SELECT id, email, name, role FROM profiles WHERE role = 'admin';

-- ========================================
-- NOTES:
-- ========================================
-- 1. This script makes policies very permissive for testing
-- 2. In production, you may want more restrictive policies
-- 3. The main issue was likely overly restrictive RLS policies
-- 4. After running this, test all operations in the admin panel
-- 5. If issues persist, you can temporarily disable RLS entirely:
--    ALTER TABLE table_name DISABLE ROW LEVEL SECURITY; 