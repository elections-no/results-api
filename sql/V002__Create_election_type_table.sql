CREATE TABLE election_type (id serial PRIMARY KEY, name VARCHAR (50) UNIQUE NOT NULL);
INSERT INTO election_type (name) VALUES ('Sametingsvalg');
INSERT INTO election_type (name) VALUES ('Stortingsvalg');
INSERT INTO election_type (name) VALUES ('Fylkestingsvalg');
INSERT INTO election_type (name) VALUES ('Kommunestyrevalg');