/*
  # User progress for gamification

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_key` (text, unique) — public key (telegram_id or session)
      - `level` (int, default 1)
      - `level_name` (text)
      - `xp` (int)
      - `xp_for_next` (int)
      - `next_level_name` (text)
      - `streak_days` (int)
      - `bonus_count` (int)
      - `badges_count` (int)
      - `created_at`, `updated_at`
  2. Security
    - Enable RLS
    - SELECT allowed to anon (public progress for demo / not yet authenticated users)
    - INSERT/UPDATE/DELETE: authenticated only, restricted to own row
  3. Seed
    - One demo row for unauthenticated visitors
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_key text UNIQUE NOT NULL,
  level int NOT NULL DEFAULT 1,
  level_name text NOT NULL DEFAULT 'Newcomer',
  xp int NOT NULL DEFAULT 0,
  xp_for_next int NOT NULL DEFAULT 100,
  next_level_name text NOT NULL DEFAULT 'Bronze Trader',
  streak_days int NOT NULL DEFAULT 0,
  bonus_count int NOT NULL DEFAULT 0,
  badges_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read progress"
  ON user_progress FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_key = auth.uid()::text);

CREATE POLICY "Authenticated can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (user_key = auth.uid()::text)
  WITH CHECK (user_key = auth.uid()::text);

CREATE POLICY "Authenticated can delete own progress"
  ON user_progress FOR DELETE
  TO authenticated
  USING (user_key = auth.uid()::text);

INSERT INTO user_progress (user_key, level, level_name, xp, xp_for_next, next_level_name, streak_days, bonus_count, badges_count)
VALUES ('demo', 3, 'Bronze Trader', 1240, 2500, 'Silver Trader', 7, 3, 12)
ON CONFLICT (user_key) DO NOTHING;
