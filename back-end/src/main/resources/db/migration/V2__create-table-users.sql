CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, login, password, role, enabled)
VALUES (
  '12345678-abcd-1234-efgh-1234567890ab',
  'admin@admin.com',
  '$2a$10$gazPrnHS20O4CSZBkfgX4ul9pblrpgfSmnG0jFV7A.bDi16j9XfjS',
  '0',
  true
);