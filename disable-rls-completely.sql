-- 🚨 EMERGENCY: DISABLE RLS COMPLETELY FOR TESTING
-- This will disable Row Level Security on all tables to test if RLS is the issue

-- Disable RLS on all tables
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_settings DISABLE ROW LEVEL SECURITY;

-- Grant full permissions to all roles
GRANT ALL ON blog_posts TO anon, authenticated;
GRANT ALL ON comments TO anon, authenticated;
GRANT ALL ON post_interactions TO anon, authenticated;
GRANT ALL ON profiles TO anon, authenticated;
GRANT ALL ON blog_settings TO anon, authenticated;

-- Test query
SELECT 'RLS disabled successfully' as status;
SELECT COUNT(*) as total_posts FROM blog_posts; 