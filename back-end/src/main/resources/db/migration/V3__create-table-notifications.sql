CREATE TABLE reservation (
    id TEXT PRIMARY KEY,
    dt_start TIMESTAMP NOT NULL,
    dt_end TIMESTAMP NOT NULL,
    status VARCHAR(255) NOT NULL,
    obs TEXT
);

CREATE TABLE notification (
    id TEXT PRIMARY KEY,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    anticipationTime TIMESTAMP,
    form VARCHAR(255),
    reservation_id TEXT,
    CONSTRAINT fk_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservation(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
