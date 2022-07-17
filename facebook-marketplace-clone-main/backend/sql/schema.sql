-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
-- Users table --
DROP TABLE IF EXISTS users cascade;
CREATE TABLE users(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), users jsonb);

-- Category table --
DROP TABLE IF EXISTS category cascade;
CREATE TABLE category(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), parent UUID DEFAULT NULL, FOREIGN KEY (parent) REFERENCES category(id), category jsonb);

DROP TABLE IF EXISTS filters;
CREATE TABLE filters(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), category_id UUID DEFAULT NULL, FOREIGN KEY (category_id) REFERENCES category(id), filters jsonb);

-- Listing table -- 
DROP TABLE IF EXISTS listing cascade;
CREATE TABLE listing(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), users_id UUID DEFAULT NULL, FOREIGN KEY (users_id) REFERENCES users(id), category_id UUID DEFAULT NULL, FOREIGN KEY (category_id) REFERENCES category(id), listing jsonb);


