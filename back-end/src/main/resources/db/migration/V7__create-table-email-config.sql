CREATE TABLE email_config (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    password VARCHAR(255) NOT NULL,
    use_ssl BOOLEAN NOT NULL
);