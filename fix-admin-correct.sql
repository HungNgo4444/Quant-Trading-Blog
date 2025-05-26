-- Fix Admin Setup - Correct Column Names
-- Run this in Supabase SQL Editor

-- 1. Check if profiles table exists and its structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- 2. Check all users in auth.users
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Check all profiles
SELECT id, email, name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- 4. Create profile for admin user (correct column names)
INSERT INTO profiles (id, email, name, role, created_at)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', 'Admin User'),
  'admin',
  NOW()
FROM auth.users u
WHERE u.email = 'admin@quantblog.com'
  AND NOT EXISTS (SELECT 1 FROM profiles WHERE email = u.email)
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  name = COALESCE(EXCLUDED.name, profiles.name);

-- 5. Update existing profile to admin (if exists)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@quantblog.com';

-- 6. Final check - show all admin users
SELECT 
  p.id,
  p.email,
  p.name,
  p.role,
  p.created_at,
  u.email_confirmed_at
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';

-- 7. If no admin user exists, create one manually
-- (Only run this if the user doesn't exist in auth.users at all)
/*
INSERT INTO profiles (id, email, name, role, created_at)
VALUES (
  gen_random_uuid(),
  'admin@quantblog.com',
  'Admin User',
  'admin',
  NOW()
) ON CONFLICT (email) DO UPDATE SET role = 'admin';
*/ 