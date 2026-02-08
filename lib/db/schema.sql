-- Valentine Week Surprise Website Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
  nickname TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access Tokens Table
CREATE TABLE IF NOT EXISTS access_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_magic_link BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for access_tokens
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_access_tokens_expires_at ON access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_access_tokens_user_id ON access_tokens(user_id);

-- Surprises Table
CREATE TABLE IF NOT EXISTS surprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN (
    'letter', 'photo', 'video', 'voice_note', 'quiz', 
    'playlist', 'memory_timeline', 'mixed'
  )),
  content_payload JSONB NOT NULL,
  media_urls TEXT[],
  locked_hint TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for surprises
CREATE INDEX IF NOT EXISTS idx_surprises_unlock_date ON surprises(unlock_date);
CREATE INDEX IF NOT EXISTS idx_surprises_order_index ON surprises(order_index);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  surprise_id UUID REFERENCES surprises(id) ON DELETE CASCADE,
  is_viewed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, surprise_id)
);

-- Indexes for user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_surprise_id ON user_progress(surprise_id);

-- Easter Eggs Table
CREATE TABLE IF NOT EXISTS easter_eggs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT UNIQUE NOT NULL,
  message TEXT NOT NULL,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discovered Easter Eggs Table
CREATE TABLE IF NOT EXISTS discovered_easter_eggs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  easter_egg_id UUID REFERENCES easter_eggs(id) ON DELETE CASCADE,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, easter_egg_id)
);

-- Indexes for discovered_easter_eggs
CREATE INDEX IF NOT EXISTS idx_discovered_easter_eggs_user_id ON discovered_easter_eggs(user_id);
CREATE INDEX IF NOT EXISTS idx_discovered_easter_eggs_egg_id ON discovered_easter_eggs(easter_egg_id);

-- Memories Table
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  rotation FLOAT DEFAULT 0,
  position TEXT CHECK (position IN ('left', 'center', 'right')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for memories
CREATE INDEX IF NOT EXISTS idx_memories_order_index ON memories(order_index);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_surprises_updated_at
  BEFORE UPDATE ON surprises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE surprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE easter_eggs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_easter_eggs ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Surprises policies
CREATE POLICY "Anyone can view surprises"
  ON surprises FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert surprises"
  ON surprises FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update surprises"
  ON surprises FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete surprises"
  ON surprises FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User Progress policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Easter Eggs policies
CREATE POLICY "Anyone can view easter eggs"
  ON easter_eggs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage easter eggs"
  ON easter_eggs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Discovered Easter Eggs policies
CREATE POLICY "Users can view their discoveries"
  ON discovered_easter_eggs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their discoveries"
  ON discovered_easter_eggs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Memories policies
CREATE POLICY "Anyone can view memories"
  ON memories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage memories"
  ON memories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create initial admin user (update with your credentials)
-- Note: You'll need to hash the password using bcrypt before inserting
-- This is just a placeholder - use the admin setup script instead
INSERT INTO users (email, password_hash, role, nickname)
VALUES (
  'admin@example.com',
  '$2a$10$placeholder_hash_replace_this',
  'admin',
  'Admin'
) ON CONFLICT (email) DO NOTHING;

-- Sample data for testing (optional)
-- Uncomment to add sample surprises

/*
INSERT INTO surprises (title, unlock_date, content_type, content_payload, locked_hint, order_index)
VALUES 
  (
    'Day 1: A Letter',
    '2024-02-08 00:00:00+00',
    'letter',
    '{"text": "Hi love, this is just the beginning...", "signature": "Your person"}',
    'Something special awaits...',
    1
  ),
  (
    'Day 2: Our First Photo',
    '2024-02-09 00:00:00+00',
    'photo',
    '{"caption": "Remember this day?"}',
    'A memory from our past...',
    2
  ),
  (
    'Day 3: A Voice Note',
    '2024-02-10 00:00:00+00',
    'voice_note',
    '{"duration": 45}',
    'Listen to my voice...',
    3
  );
*/
