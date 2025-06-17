CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(255) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, login, password, role, profession, phoneNumber, enabled)
VALUES (
  '12345678-abcd-1234-efgh-1234567890ab',
  'Admin',
  'admin@admin.com',
  '$2a$10$gazPrnHS20O4CSZBkfgX4ul9pblrpgfSmnG0jFV7A.bDi16j9XfjS',
  'ADMIN',
  'TEACHER',
  '(42) 99999-9999',
  true
);
