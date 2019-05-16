CREATE TABLE county (id serial PRIMARY KEY, nr VARCHAR (10) UNIQUE NOT NULL, name VARCHAR (50) NOT NULL);
INSERT INTO county (nr, name) VALUES ('01', 'Østfold');
INSERT INTO county (nr, name) VALUES ('02', 'Akershus');
INSERT INTO county (nr, name) VALUES ('03', 'Oslo');
INSERT INTO county (nr, name) VALUES ('04', 'Hedmark');
INSERT INTO county (nr, name) VALUES ('05', 'Oppland');
INSERT INTO county (nr, name) VALUES ('06', 'Buskerud');
INSERT INTO county (nr, name) VALUES ('07', 'Vestfold');
INSERT INTO county (nr, name) VALUES ('08', 'Telemark');
INSERT INTO county (nr, name) VALUES ('09', 'Aust-Agder');
INSERT INTO county (nr, name) VALUES ('10', 'Vest-Agder');
INSERT INTO county (nr, name) VALUES ('11', 'Rogaland');
INSERT INTO county (nr, name) VALUES ('12', 'Hordaland');
INSERT INTO county (nr, name) VALUES ('13', 'Bergen');
INSERT INTO county (nr, name) VALUES ('14', 'Sogn og Fjordane');
INSERT INTO county (nr, name) VALUES ('15', 'Møre og Romsdal');
INSERT INTO county (nr, name) VALUES ('16', 'Sør-Trøndelag');
INSERT INTO county (nr, name) VALUES ('17', 'Nord-Trøndelag');
INSERT INTO county (nr, name) VALUES ('18', 'Nordland');
INSERT INTO county (nr, name) VALUES ('19', 'Troms');
INSERT INTO county (nr, name) VALUES ('20', 'Finnmark');
INSERT INTO county (nr, name) VALUES ('21', 'Svalbard');
INSERT INTO county (nr, name) VALUES ('22', 'Jan Mayen');

/* New numbers */
INSERT INTO county (nr, name) VALUES ('50', 'Trøndelag');