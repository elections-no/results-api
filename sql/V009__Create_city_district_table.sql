CREATE TABLE city_district (id serial PRIMARY KEY, nr VARCHAR (10) UNIQUE NOT NULL, name VARCHAR (50) NOT NULL, municipality INTEGER REFERENCES municipality(id) NOT NULL);