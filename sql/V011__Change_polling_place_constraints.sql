ALTER TABLE polling_place DROP COLUMN city_district RESTRICT;
ALTER TABLE polling_place DROP COLUMN municipality RESTRICT;
ALTER TABLE polling_place DROP COLUMN county RESTRICT;

ALTER TABLE polling_place ADD COLUMN city_district VARCHAR (10);
ALTER TABLE polling_place ADD COLUMN municipality VARCHAR (10);
ALTER TABLE polling_place ADD COLUMN county VARCHAR (10);

ALTER TABLE polling_place ADD CONSTRAINT city_district_fk FOREIGN KEY (city_district) REFERENCES city_district (nr) MATCH FULL;
ALTER TABLE polling_place ADD CONSTRAINT municipality_fk FOREIGN KEY (municipality) REFERENCES municipality (nr) MATCH FULL;
ALTER TABLE polling_place ADD CONSTRAINT county_fk FOREIGN KEY (county) REFERENCES county (nr) MATCH FULL;