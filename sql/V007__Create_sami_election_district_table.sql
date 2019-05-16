CREATE TABLE sami_election_district (id serial PRIMARY KEY, nr VARCHAR (10) UNIQUE NOT NULL, name VARCHAR (50) NOT NULL);
INSERT INTO sami_election_district (nr, name) VALUES ('0001', 'Østre valgkrets');
INSERT INTO sami_election_district (nr, name) VALUES ('0002', 'Ávjovári valgkrets');
INSERT INTO sami_election_district (nr, name) VALUES ('0003', 'Nordre valgkrets');
INSERT INTO sami_election_district (nr, name) VALUES ('0004', 'Gáisi valgkrets');
INSERT INTO sami_election_district (nr, name) VALUES ('0005', 'Vesthavet valgkrets');
INSERT INTO sami_election_district (nr, name) VALUES ('0006', 'Sørsamisk valgkrets');
INSERT INTO sami_election_district (nr, name) VALUES ('0007', 'Sør-Norge valgkrets');