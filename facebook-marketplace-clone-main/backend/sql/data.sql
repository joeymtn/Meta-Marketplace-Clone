DELETE FROM listing; 
DELETE FROM category;
DELETE FROM users;
-- Populate Your Tables Here --
INSERT INTO category(id, parent, category) VALUES ('608eab18-05a5-4f03-a6c6-eb06e36f2b6d', null, '{"name": "Vehicle"}');
INSERT INTO category(id, parent, category) VALUES ('fdfcf56a-58f7-404f-8a84-5bec9a26643c', '608eab18-05a5-4f03-a6c6-eb06e36f2b6d', '{"name": "Motorcycle"}');
INSERT INTO category(id, parent, category) VALUES ('00d55315-cf9c-456e-bbf6-9360a10f8a2f', '608eab18-05a5-4f03-a6c6-eb06e36f2b6d', '{"name": "Car"}');
INSERT INTO category(id, parent, category) VALUES ('a9613909-d1b4-4de4-b6fc-b343a979236b', '00d55315-cf9c-456e-bbf6-9360a10f8a2f', '{"name": "Truck"}');
INSERT INTO category(id, parent, category) VALUES ('f2fce94a-f9c8-49b7-9b53-54d5ee3ca486', '00d55315-cf9c-456e-bbf6-9360a10f8a2f', '{"name": "SUV"}');
INSERT INTO category(id, parent, category) VALUES ('65e66254-47a7-4607-a9c9-2a2aa112dc03', null, '{"name": "Real Estate"}');
INSERT INTO category(id, parent, category) VALUES ('2927ac2b-0167-444a-9b8b-582476cea093', '65e66254-47a7-4607-a9c9-2a2aa112dc03', '{"name": "House"}');
INSERT INTO category(id, parent, category) VALUES ('117aa2e1-4228-406d-8402-b3d2e3dd611d', '65e66254-47a7-4607-a9c9-2a2aa112dc03', '{"name": "Apartment"}');

INSERT INTO filters(id, category_id, filters) VALUES ('e1c83583-a4c7-406a-b287-6698ad1010b7', '608eab18-05a5-4f03-a6c6-eb06e36f2b6d', '{"filters": {"make": "select", "type": "select", "color": "select", "mileage": "select"}}');
INSERT INTO filters(id, category_id, filters) VALUES ('eebc20b8-95f1-4603-bcf7-337ce92d3a50', '65e66254-47a7-4607-a9c9-2a2aa112dc03', '{"filters": {"bedrooms": "select", "bathrooms": "select", "sqFootage": "select", "pool": "select", "garage": "select"}}');
INSERT INTO filters(id, category_id, filters) VALUES ('e04abaf2-2695-48d5-997a-a3f152617344', 'fdfcf56a-58f7-404f-8a84-5bec9a26643c', '{"filters": {"minPrice": "range", "maxPrice": "range"}}');
INSERT INTO filters(id, category_id, filters) VALUES ('2bc08202-12bb-422a-ba67-8220e35d9bf1', '00d55315-cf9c-456e-bbf6-9360a10f8a2f', '{"filters": {"minPrice": "range", "maxPrice": "range"}}');
INSERT INTO filters(id, category_id, filters) VALUES ('84f7818f-176b-41ab-a94c-7fbd325adfe9', 'a9613909-d1b4-4de4-b6fc-b343a979236b', '{"filters": {"minPrice": "range", "maxPrice": "range"}}');
INSERT INTO filters(id, category_id, filters) VALUES ('a9cf6b9e-384a-4159-92cd-2532bb74dcbf', 'f2fce94a-f9c8-49b7-9b53-54d5ee3ca486', '{"filters": {"minPrice": "range", "maxPrice": "range"}}');
INSERT INTO filters(id, category_id, filters) VALUES ('5108eed1-6dec-4a42-8c5b-e868efa14d5a', '2927ac2b-0167-444a-9b8b-582476cea093', '{"filters": {"minPrice": "range", "maxPrice": "range"}}');
INSERT INTO filters(id, category_id, filters) VALUES ('831c2a52-9dec-470e-8be8-1eaad1973503', '117aa2e1-4228-406d-8402-b3d2e3dd611d', '{"filters": {"minPrice": "range", "maxPrice": "range"}}');

-- User data 
INSERT INTO users (id, users) VALUES ('251f8984-7ff6-4f92-a214-f0c692af0f44', '{"name":"Lacee","email":"lhaswell0@ehow.com","password":"tdmiPKg4","phone":"246-157-5800"}');
INSERT INTO users (id, users) VALUES ('7fab0b73-f22f-4ccc-a85c-777d987657d4', '{"name":"John","email":"johndoe@gmail.com","password":"1234","phone":"245-243-5690"}'); 
INSERT INTO users (id, users) VALUES ('6ee0fc64-9027-46d1-81c6-d71a8ae2a298', '{"name":"Jess","email":"jesswillington@yahoo.com","password":"4567","phone":"245-134-4542"}');
-- Car listings
INSERT INTO listing (category_id, users_id, listing) VALUES ('608eab18-05a5-4f03-a6c6-eb06e36f2b6d', '251f8984-7ff6-4f92-a214-f0c692af0f44', '{"title":"Galant","description": "Mitsubishi","imageLink": "http://dummyimage.com/157x100.png/5fa2dd/ffffff","price": "$4084.41","location": "California", "username": "abunker1","created": "7/12/2021"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('fdfcf56a-58f7-404f-8a84-5bec9a26643c', '251f8984-7ff6-4f92-a214-f0c692af0f44', '{"title":"Navigator","description":"Lincoln","imageLink":"http://dummyimage.com/123x100.png/cc0000/ffffff","price":"$2909.80","location":"California","username":"emitchell0","created":"12/24/2020"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('a9613909-d1b4-4de4-b6fc-b343a979236b', '251f8984-7ff6-4f92-a214-f0c692af0f44', '{"title":"Lancer Evolution","description":"Mitsubishi","imageLink":"http://dummyimage.com/167x100.png/dddddd/000000","price":"$6221.95","location":"California","username":"zserginson1","created":"5/16/2021"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('f2fce94a-f9c8-49b7-9b53-54d5ee3ca486', '251f8984-7ff6-4f92-a214-f0c692af0f44', '{"title":"MurciÃ©lago","description":"Lamborghini","imageLink":"http://dummyimage.com/119x100.png/ff4444/ffffff","price":"$4662.07","location":"California","username":"zfairbard2","created":"12/25/2020"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('f2fce94a-f9c8-49b7-9b53-54d5ee3ca486', '7fab0b73-f22f-4ccc-a85c-777d987657d4', '{"title":"Ram 3500","description":"Dodge","imageLink":"http://dummyimage.com/244x100.png/dddddd/000000","price":"$8305.89","location":"California","username":"jcarlone3","created":"11/17/2021"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('fdfcf56a-58f7-404f-8a84-5bec9a26643c', '7fab0b73-f22f-4ccc-a85c-777d987657d4', '{"title":"LHS","description":"Chrysler","imageLink":"http://dummyimage.com/145x100.png/cc0000/ffffff","price":"$7985.11","location":"California","username":"sbyard4","created":"11/24/2021"}');

-- Real Estate listings
INSERT INTO listing (category_id, users_id, listing) VALUES ('65e66254-47a7-4607-a9c9-2a2aa112dc03', '7fab0b73-f22f-4ccc-a85c-777d987657d4', '{"title":"House 1","description":"4 Bedroom house with a huge bathtub","imageLink": "http://dummyimage.com/156x100.png/5fa2dd/ffffff","price":"$10,123.11","location":"California","username":"sbyard4","created":"11/24/2021"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('65e66254-47a7-4607-a9c9-2a2aa112dc03', '7fab0b73-f22f-4ccc-a85c-777d987657d4', '{"title":"House 2","description":"4 Bedroom house with a large front porch","imageLink":"http://dummyimage.com/157x100.png/5fa2dd/ffffff","price":"$10,123.11","location":"California","username":"sbyard4","created":"11/24/2021"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('2927ac2b-0167-444a-9b8b-582476cea093', '6ee0fc64-9027-46d1-81c6-d71a8ae2a298', '{"title":"House 3","description":"2 Bedroom house with a small patio","imageLink": "http://dummyimage.com/158x100.png/5fa2dd/ffffff","price":"$10,123.11","location":"California","username":"sbyard4","created":"11/24/2021"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('2927ac2b-0167-444a-9b8b-582476cea093', '6ee0fc64-9027-46d1-81c6-d71a8ae2a298', '{"title":"House 4","description":"3 Bedroom house with a small garage","imageLink": "http://dummyimage.com/159x100.png/5fa2dd/ffffff","price":"$10,123.11","location":"California","username":"sbyard4","created":"11/24/2021"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('117aa2e1-4228-406d-8402-b3d2e3dd611d', '6ee0fc64-9027-46d1-81c6-d71a8ae2a298', '{"title":"Apartment 1","description":"2 Bedroom apartment","imageLink": "http://dummyimage.com/160x100.png/5fa2dd/ffffff","price":"$10,123.11","location":"California","username":"sbyard4","created":"11/24/2021"}');
INSERT INTO listing (category_id, users_id, listing) VALUES ('117aa2e1-4228-406d-8402-b3d2e3dd611d', '6ee0fc64-9027-46d1-81c6-d71a8ae2a298', '{"title":"Apartment 2","description":"1 Bedroom studio","imageLink": "http://dummyimage.com/161x100.png/5fa2dd/ffffff","price":"$10,123.11","location":"California","username":"sbyard4","created":"11/24/2021"}');




