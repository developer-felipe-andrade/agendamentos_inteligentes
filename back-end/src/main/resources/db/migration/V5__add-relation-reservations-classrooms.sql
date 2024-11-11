ALTER TABLE reservation
ADD COLUMN classroom_id TEXT;

ALTER TABLE reservation
ADD CONSTRAINT fk_classroom
FOREIGN KEY (classroom_id)
REFERENCES classrooms(id)
ON DELETE SET NULL
ON UPDATE CASCADE;