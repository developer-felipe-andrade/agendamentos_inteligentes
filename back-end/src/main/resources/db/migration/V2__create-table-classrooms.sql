CREATE TABLE classrooms (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    qtd_place INT NOT NULL,
    block VARCHAR(255),
    is_accessible BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT FALSE,
    confirmation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);
