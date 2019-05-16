CREATE TABLE polling_place (
    id serial PRIMARY KEY, 
    nr VARCHAR (10) UNIQUE NOT NULL, 
    name VARCHAR (50) NOT NULL,
    city_district INTEGER REFERENCES city_district(id),
    municipality INTEGER REFERENCES municipality(id),
    county INTEGER REFERENCES county(id),
    polling_place_type INTEGER REFERENCES polling_place_type(id) NOT NULL
);