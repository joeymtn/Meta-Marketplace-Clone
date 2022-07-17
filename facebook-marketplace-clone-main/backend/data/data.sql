DELETE FROM category;

-- INSERT INTO category(id, parent, category) VALUES ('608eab18-05a5-4f03-a6c6-eb06e36f2b6d', '"undefined"', '{"name": "Vehicle", "info":{"make": "Toyota", "mileage": 10500, "color": "gray", "seats": 4, "bedrooms": undefined, "bathrooms": undefined, "squareFootage": undefined, "pool": undefined, "garage": undefined,}}');
INSERT INTO category(id, parent, category) VALUES ('"608eab18-05a5-4f03-a6c6-eb06e36f2b6d"', '"undefined"', '{"name": "Vehicle", "info":{}}');
INSERT INTO category(id, parent, category) VALUES ('"fdfcf56a-58f7-404f-8a84-5bec9a26643c"', '"608eab18-05a5-4f03-a6c6-eb06e36f2b6d"', '{"name": "Motorcycle", "info":{}}');
INSERT INTO category(id, parent, category) VALUES ('"00d55315-cf9c-456e-bbf6-9360a10f8a2f"', '"608eab18-05a5-4f03-a6c6-eb06e36f2b6d"', '{"name": "Car", "info":{}}');
INSERT INTO category(id, parent, category) VALUES ('"65e66254-47a7-4607-a9c9-2a2aa112dc03"', '"undefined"', '{"name": "Real Estate", "info":{}}');
INSERT INTO category(id, parent, category) VALUES ('"2927ac2b-0167-444a-9b8b-582476cea093"', '"65e66254-47a7-4607-a9c9-2a2aa112dc03"', '{"name": "House", "info":{}}');
INSERT INTO category(id, parent, category) VALUES ('"117aa2e1-4228-406d-8402-b3d2e3dd611d"', '"65e66254-47a7-4607-a9c9-2a2aa112dc03"', '{"name": "Apartment", "info":{}}');