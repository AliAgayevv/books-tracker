ALTER TABLE users
  ADD COLUMN two_factor_secret  VARCHAR(255),
  ADD COLUMN two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- No pass for OAuth users, so make password_hash nullable
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;


CREATE TABLE oauth_accounts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider    VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider, provider_id)
);

CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
