CREATE TABLE resources (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resource_classroom (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    resource_id TEXT NOT NULL,
    classroom_id TEXT NOT NULL,
    qtd INT NOT NULL DEFAULT 1,

    CONSTRAINT fk_classroom FOREIGN KEY (classroom_id)
        REFERENCES classrooms(id) ON DELETE CASCADE,

    CONSTRAINT fk_resource FOREIGN KEY (resource_id)
        REFERENCES resources(id) ON DELETE RESTRICT
);