
CREATE DATABASE paranormal_db;



CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT
);



CREATE TABLE Livre (
    id SERIAL PRIMARY KEY,
    titre TEXT NOT NULL,
    auteur TEXT,
    prix NUMERIC NOT NULL,
    disponibilite TEXT,
    note INTEGER,
    image_url TEXT,
    description TEXT
);