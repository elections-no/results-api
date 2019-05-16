CREATE TABLE election_event ("id" serial PRIMARY KEY, "date" DATE UNIQUE NOT NULL, "name" VARCHAR (100) UNIQUE NOT NULL);
INSERT INTO election_event (date, name) values ('2009-09-14', 'Stortings- og sametingsvalget  2009');
INSERT INTO election_event (date, name) values ('2011-09-12', 'Kommunestyre- og fylkestingsvalget 2011');
INSERT INTO election_event (date, name) values ('2013-09-09', 'Stortings- og sametingsvalget  2013');
INSERT INTO election_event (date, name) values ('2015-09-14', 'Kommunestyre- og fylkestingsvalget 2015');
INSERT INTO election_event (date, name) values ('2017-09-11', 'Stortings- og sametingsvalget 2017');
INSERT INTO election_event (date, name) values ('2019-09-09', 'Kommunestyre- og fylkestingsvalget 2019');