PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','active','closed')),
  magazine_issue_id TEXT NOT NULL,
  max_songs_per_vote INTEGER NOT NULL DEFAULT 5 CHECK (max_songs_per_vote BETWEEN 1 AND 20),
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS one_active_campaign ON campaigns(status) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  region TEXT,
  area TEXT,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'candidate' CHECK (status IN ('candidate','published','retired'))
);
CREATE TABLE IF NOT EXISTS campaign_songs (
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  song_id TEXT NOT NULL REFERENCES songs(id),
  position INTEGER NOT NULL,
  PRIMARY KEY (campaign_id, song_id),
  UNIQUE (campaign_id, position)
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (campaign_id, user_id)
);
CREATE TABLE IF NOT EXISTS vote_choices (
  vote_id TEXT NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  song_id TEXT NOT NULL REFERENCES songs(id),
  PRIMARY KEY (vote_id, song_id)
);
CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  campaign_id TEXT REFERENCES campaigns(id),
  song_title TEXT NOT NULL,
  region TEXT,
  source_url TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','on_hold','rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS recommendations_by_user ON recommendations(user_id, campaign_id);
CREATE TABLE IF NOT EXISTS magazine_issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'preview' CHECK (status IN ('preview','published','archived'))
);
CREATE TABLE IF NOT EXISTS magazine_articles (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL REFERENCES magazine_issues(id),
  song_id TEXT REFERENCES songs(id),
  title TEXT NOT NULL,
  body_path TEXT NOT NULL,
  position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','fact_check','editing','approved','published')),
  UNIQUE(issue_id, position)
);
CREATE TABLE IF NOT EXISTS entitlements (
  user_id TEXT NOT NULL REFERENCES users(id),
  issue_id TEXT NOT NULL REFERENCES magazine_issues(id),
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  granted_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, issue_id)
);
