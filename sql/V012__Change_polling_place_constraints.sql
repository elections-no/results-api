ALTER TABLE polling_place DROP COLUMN name RESTRICT;
ALTER TABLE polling_place ADD COLUMN name VARCHAR (100) NOT NULL;