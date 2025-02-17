ALTER TABLE classrooms ADD COLUMN avg_rating DECIMAL(3,2) DEFAULT 0;

CREATE TABLE reviews (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    classroom_id TEXT NOT NULL,
    reservation_id TEXT NOT NULL,
    user_id TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    pending BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

