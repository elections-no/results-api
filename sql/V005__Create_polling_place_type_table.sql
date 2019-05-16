CREATE TABLE polling_place_type (id serial PRIMARY KEY, name VARCHAR (50) UNIQUE NOT NULL);
INSERT INTO polling_place_type (name) VALUES ('Samevalgdistrikt');
INSERT INTO polling_place_type (name) VALUES ('Stemmekrets');