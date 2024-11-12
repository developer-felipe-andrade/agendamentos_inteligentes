ALTER TABLE reservations
ADD COLUMN classroom_id TEXT;

ALTER TABLE reservations
ADD CONSTRAINT fk_classroom
FOREIGN KEY (classroom_id)
REFERENCES classrooms(id)
ON DELETE SET NULL
ON UPDATE CASCADE;
