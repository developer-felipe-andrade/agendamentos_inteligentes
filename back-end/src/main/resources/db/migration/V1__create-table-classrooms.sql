CREATE TABLE classrooms (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    qtd_place INT NOT NULL,
    block VARCHAR(255),
    is_acessibled BOOLEAN,
    status VARCHAR(50),
    confirmation BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
