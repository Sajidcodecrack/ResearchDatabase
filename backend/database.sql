-- Create the database
CREATE DATABASE Research_Hub;

-- Use the newly created database
USE Research_Hub;

-- Drop tables if they exist
DROP TABLE IF EXISTS login_db;
DROP TABLE IF EXISTS registration_db;

-- Create the registration_db table
CREATE TABLE registration_db (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the login_db table
CREATE TABLE login_db (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    registration_id INT,
    FOREIGN KEY (registration_id) REFERENCES registration_db(id)
);

-- Select statements
SELECT * FROM registration_db;
SELECT * FROM login_db;
