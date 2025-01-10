-- Create the database
CREATE DATABASE Research_Hub;
 DROP DATABASE IF EXISTS Research_Hub;
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
    role ENUM('Student', 'Teacher') NOT NULL,
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


SELECT * FROM registration_db;
SELECT * FROM login_db;

-- 1. Retrieve all users with a specific role
SELECT * FROM registration_db
WHERE role = 'Student';

-- 2. Find the user with the most recent registration
SELECT * FROM registration_db
ORDER BY id DESC
LIMIT 1;

-- 3. Join registration_db and login_db tables to get user details and their login information
SELECT registration_db.name, registration_db.email, login_db.email, login_db.password 
FROM registration_db
JOIN login_db ON registration_db.id = login_db.registration_id;

-- 4. Count total users
SELECT COUNT(*) AS total_users FROM registration_db;

-- 5. Find users whose email ends with a specific domain
SELECT * FROM registration_db
WHERE email LIKE '%@example.com';

-- 6. Retrieve users who have registered but have no login record yet
SELECT registration_db.* 
FROM registration_db
LEFT JOIN login_db ON registration_db.id = login_db.registration_id
WHERE login_db.id IS NULL;

-- 7. Complex search using multiple conditions
SELECT registration_db.*
FROM registration_db
LEFT JOIN login_db ON registration_db.id = login_db.registration_id
WHERE registration_db.role = 'Teacher' AND login_db.id IS NULL AND registration_db.email LIKE '%@example.com';

-- 8. Aggregate function
SELECT COUNT(*) AS total_students, COUNT(*) AS total_teachers
FROM registration_db
WHERE role = 'Student' OR role = 'Teacher';
