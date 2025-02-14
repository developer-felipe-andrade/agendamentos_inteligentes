CREATE TABLE reservations (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    dt_start TIMESTAMP NOT NULL,
    dt_end TIMESTAMP NOT NULL,
    status VARCHAR(255) NOT NULL,
    obs TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_email VARCHAR(255) NOT NULL
);


CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    anticipation_time TIMESTAMP,
    form VARCHAR(255),
    reservation_id TEXT,
    notified BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);