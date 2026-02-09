-- Add password_hint to settings table
-- Run this in Supabase SQL Editor if you already have the settings table

INSERT INTO settings (key, value) VALUES
  ('password_hint', 'Our special date 💕')
ON CONFLICT (key) DO NOTHING;
