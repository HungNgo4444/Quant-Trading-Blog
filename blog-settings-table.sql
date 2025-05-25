-- Create blog_settings table
CREATE TABLE IF NOT EXISTS public.blog_settings (
    id TEXT PRIMARY KEY DEFAULT '1',
    blog_title TEXT NOT NULL DEFAULT 'Quantitative Trading Blog',
    blog_description TEXT NOT NULL DEFAULT '',
    author_name TEXT NOT NULL DEFAULT 'Quant Trader',
    author_bio TEXT NOT NULL DEFAULT '',
    author_image TEXT DEFAULT '',
    contact_email TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    main_topics TEXT[] DEFAULT '{}',
    mission_title TEXT DEFAULT 'Mục tiêu của blog',
    mission_description TEXT DEFAULT '',
    education_description TEXT DEFAULT '',
    practice_description TEXT DEFAULT '',
    research_description TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_settings
CREATE POLICY "Blog settings are viewable by everyone" ON public.blog_settings
    FOR SELECT USING (true);

CREATE POLICY "Only admins can update blog settings" ON public.blog_settings
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can insert blog settings" ON public.blog_settings
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin'); 