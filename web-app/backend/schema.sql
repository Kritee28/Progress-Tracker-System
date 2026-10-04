-- Reference schema for a future MySQL persistence adapter.
-- The current application uses the local JSON adapter in src/store.js.
CREATE DATABASE IF NOT EXISTS progress_tracker;
USE progress_tracker;

CREATE TABLE users (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  daily_goal SMALLINT UNSIGNED NOT NULL DEFAULT 5,
  weekly_goal SMALLINT UNSIGNED NOT NULL DEFAULT 20,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problems (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NOT NULL,
  title VARCHAR(255) NOT NULL,
  platform VARCHAR(100) NOT NULL DEFAULT '',
  url VARCHAR(2048) NOT NULL DEFAULT '',
  topic VARCHAR(100) NOT NULL DEFAULT '',
  difficulty ENUM('Easy','Medium','Hard') NOT NULL DEFAULT 'Medium',
  status ENUM('todo','attempted','solved') NOT NULL DEFAULT 'todo',
  notes TEXT NOT NULL,
  solved_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_problems_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_problems_user_solved (user_id, status, solved_at),
  INDEX idx_problems_user_topic (user_id, topic)
);

CREATE TABLE revisions (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NOT NULL,
  problem_id VARCHAR(40) NOT NULL,
  sequence_no TINYINT UNSIGNED NOT NULL,
  due_date DATE NOT NULL,
  completed_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_revisions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_revisions_problem FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
  UNIQUE KEY uq_revision_sequence (problem_id, sequence_no),
  INDEX idx_revisions_user_due (user_id, completed_at, due_date)
);
