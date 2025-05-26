-- Add is_hidden field to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- Update existing posts to be visible by default
UPDATE blog_posts SET is_hidden = FALSE WHERE is_hidden IS NULL;

-- Test query
SELECT id, title, is_hidden FROM blog_posts LIMIT 5; 