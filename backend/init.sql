-- HobbyLily Database Schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  avatar_color VARCHAR(50) DEFAULT '#A8C4D4',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance at scale
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_modtime ON users;
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TABLE IF NOT EXISTS hobbies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  emoji VARCHAR(10) DEFAULT '🌸',
  bloom_stage VARCHAR(50) DEFAULT 'seed',
  progress INTEGER DEFAULT 0,
  days_active INTEGER DEFAULT 0,
  difficulty VARCHAR(50) DEFAULT 'beginner',
  estimated_time_per_day VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  hobby_id INTEGER REFERENCES hobbies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_time VARCHAR(100),
  status VARCHAR(50) DEFAULT 'upcoming',
  order_index INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  hobby_id INTEGER REFERENCES hobbies(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  mood VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed demo users
INSERT INTO users (name, email, password) VALUES 
  ('Demo User', 'demo@hobbylily.com', '$2a$10$XQofMzXk5DGWtPqKJiIAB.Mn2sAWK2HnBm9b.E1qrJMi0D7Dx6PuO'),
  ('Priya Sharma', 'priya@hobbylily.com', '$2a$10$o/l1G4EbEqxD/lcqjxmqb.i1JVbNSqoHZYT7fijWJi7HA3wDW1hMm')
ON CONFLICT (email) DO NOTHING;

-- Seed hobbies for demo user
DO $$
DECLARE
  demo_id INTEGER;
  guitar_id INTEGER;
  watercolor_id INTEGER;
  photo_id INTEGER;
BEGIN
  SELECT id INTO demo_id FROM users WHERE email = 'demo@hobbylily.com';

  INSERT INTO hobbies (user_id, name, emoji, bloom_stage, progress, days_active, difficulty, estimated_time_per_day)
  VALUES (demo_id, 'Guitar', '🎸', 'sprout', 23, 18, 'beginner', '30 mins/day')
  RETURNING id INTO guitar_id;

  INSERT INTO hobbies (user_id, name, emoji, bloom_stage, progress, days_active, difficulty, estimated_time_per_day)
  VALUES (demo_id, 'Watercolor Painting', '🎨', 'bud', 61, 34, 'intermediate', '45 mins/day')
  RETURNING id INTO watercolor_id;

  INSERT INTO hobbies (user_id, name, emoji, bloom_stage, progress, days_active, difficulty, estimated_time_per_day)
  VALUES (demo_id, 'Photography', '📷', 'seed', 8, 6, 'beginner', '20 mins/day')
  RETURNING id INTO photo_id;

  -- Guitar tasks
  INSERT INTO tasks (hobby_id, title, description, estimated_time, status, order_index) VALUES
  (guitar_id, 'Learn the parts of a guitar', 'Understand neck, frets, body, tuning pegs, bridge and their roles', '30 mins', 'completed', 1),
  (guitar_id, 'Understand standard tuning', 'Learn EADGBE tuning and how to use a tuner app', '45 mins', 'completed', 2),
  (guitar_id, 'Practice holding the pick', 'Master pick grip and angle for clear strums', '20 mins', 'completed', 3),
  (guitar_id, 'Learn C major chord', 'Finger placement and clean chord transition exercises', '1 hour', 'completed', 4),
  (guitar_id, 'Learn G major chord', 'Practice switching between C and G smoothly', '1 hour', 'completed', 5),
  (guitar_id, 'Learn D major chord', 'Practice 15 mins daily for 3 days until clean', '3 days × 15 mins', 'current', 6),
  (guitar_id, 'Learn Em chord', 'The easiest chord — practice transitions from D', '30 mins', 'upcoming', 7),
  (guitar_id, 'Play your first song (Knockin'' on Heaven''s Door)', 'Slow version with basic chords G, D, Em', '2 hours', 'upcoming', 8),
  (guitar_id, 'Learn basic strumming patterns', 'Down-up patterns and timing with a metronome', '1.5 hours', 'upcoming', 9),
  (guitar_id, 'Record your first 60 second video', 'Share your progress with the HobbyLily community', '1 hour', 'upcoming', 10);

  -- Watercolor tasks
  INSERT INTO tasks (hobby_id, title, description, estimated_time, status, order_index) VALUES
  (watercolor_id, 'Set up your workspace', 'Get the essential supplies: paints, paper, brushes, water cups', '1 hour', 'completed', 1),
  (watercolor_id, 'Learn color mixing basics', 'Primary colors, warm vs cool, making neutrals', '2 hours', 'completed', 2),
  (watercolor_id, 'Practice wet-on-wet technique', 'Soft blooms and color blending on wet paper', '1.5 hours', 'completed', 3),
  (watercolor_id, 'Paint a simple gradient wash', 'Sky gradients from deep to pale blue', '1 hour', 'completed', 4),
  (watercolor_id, 'Paint loose botanicals', 'Simple leaves and petals using brush pressure', '2 hours', 'completed', 5),
  (watercolor_id, 'Paint a simple landscape', 'Layered mountains or rolling hills with atmosphere', '2 hours', 'current', 6),
  (watercolor_id, 'Learn negative painting', 'Painting around shapes to reveal them', '2 hours', 'upcoming', 7),
  (watercolor_id, 'Create a full composition', 'Original piece with foreground, mid and background', '3 hours', 'upcoming', 8),
  (watercolor_id, 'Share your first piece', 'Post a photo to the community with honest notes', '30 mins', 'upcoming', 9),
  (watercolor_id, 'Start a 30-day painting challenge', 'One small painting per day', '30 days', 'upcoming', 10);

  -- Photography tasks
  INSERT INTO tasks (hobby_id, title, description, estimated_time, status, order_index) VALUES
  (photo_id, 'Understand your camera settings', 'Learn ISO, aperture, shutter speed triangle', '2 hours', 'completed', 1),
  (photo_id, 'Practice the rule of thirds', 'Compose 20 shots using grid guidelines', '1 hour', 'upcoming', 2),
  (photo_id, 'Shoot in golden hour light', 'Capture 10 subjects in morning or evening light', '2 hours', 'upcoming', 3),
  (photo_id, 'Learn basic editing in Lightroom', 'Exposure, contrast, color grading basics', '3 hours', 'upcoming', 4),
  (photo_id, 'Shoot a portrait session', 'Natural light portrait with a friend or self-portrait', '2 hours', 'upcoming', 5),
  (photo_id, 'Try macro photography', 'Get close to flowers, insects, textures', '1.5 hours', 'upcoming', 6),
  (photo_id, 'Create a photo story', '5-10 images that tell a coherent narrative', '3 hours', 'upcoming', 7),
  (photo_id, 'Critique your own work', 'Review your best 5 photos and note what you''d improve', '1 hour', 'upcoming', 8),
  (photo_id, 'Share your first photo essay', 'Post curated images to community with captions', '1 hour', 'upcoming', 9),
  (photo_id, 'Shoot a month-long project', 'One theme, 30 days, one photo per day', '30 days', 'upcoming', 10);

END $$;
