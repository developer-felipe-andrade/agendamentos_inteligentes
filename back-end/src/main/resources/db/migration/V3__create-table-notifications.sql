CREATE TABLE reservations (
    id TEXT PRIMARY KEY,
    dt_start TIMESTAMP NOT NULL,
    dt_end TIMESTAMP NOT NULL,
    status VARCHAR(255) NOT NULL,
    obs TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    anticipationTime TIMESTAMP,
    form VARCHAR(255),
    reservation_id TEXT,
    CONSTRAINT fk_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
