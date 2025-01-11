-- Create and use the database
CREATE DATABASE IF NOT EXISTS Research_Hub;
USE Research_Hub;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS dashboard;
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

-- Create the dashboard table
CREATE TABLE dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    login_count INT DEFAULT 0,
    last_login TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (registration_id) REFERENCES registration_db(id)
);

-- Queries for data retrieval and complex operations:

-- 1. Update login data in the dashboard table
-- When a user logs in, update their login count and last login timestamp
UPDATE dashboard
SET 
    login_count = login_count + 1,
    last_login = NOW()
WHERE registration_id = (
    SELECT id FROM registration_db WHERE email = '@gmail.com'
);

-- 2. Retrieve all users with their login count and last login details
SELECT 
    registration_db.name AS user_name, 
    registration_db.email, 
    registration_db.role, 
    COALESCE(dashboard.login_count, 0) AS login_count, 
    dashboard.last_login
FROM registration_db
LEFT JOIN dashboard ON registration_db.id = dashboard.registration_id;

-- 3. Find users with the highest login counts using a subquery
SELECT 
    registration_db.name AS user_name, 
    registration_db.email, 
    dashboard.login_count
FROM registration_db
JOIN dashboard ON registration_db.id = dashboard.registration_id
WHERE dashboard.login_count = (
    SELECT MAX(login_count) FROM dashboard
);

-- 4. Retrieve users who have registered but never logged in
SELECT registration_db.*
FROM registration_db
WHERE registration_db.id NOT IN (
    SELECT registration_id FROM dashboard
);

-- 5. Aggregate function: Count total users by role and logins
SELECT 
    registration_db.role, 
    COUNT(*) AS total_users,
    SUM(COALESCE(dashboard.login_count, 0)) AS total_logins
FROM registration_db
LEFT JOIN dashboard ON registration_db.id = dashboard.registration_id
GROUP BY registration_db.role;

-- 6. Retrieve login trends by role, with subquery to calculate average logins
SELECT 
    registration_db.role, 
    COUNT(dashboard.id) AS total_logins, 
    MAX(dashboard.last_login) AS last_login,
    AVG(COALESCE(dashboard.login_count, 0)) AS avg_logins
FROM registration_db
LEFT JOIN dashboard ON registration_db.id = dashboard.registration_id
GROUP BY registration_db.role;

-- 7. Retrieve users with specific email domains who have logged in more than a certain number of times
SELECT 
    registration_db.name AS user_name, 
    registration_db.email, 
    dashboard.login_count
FROM registration_db
JOIN dashboard ON registration_db.id = dashboard.registration_id
WHERE registration_db.email LIKE '%@gmail.com%' AND dashboard.login_count > 1;

-- 8. Find users who logged in today
SELECT 
    registration_db.name AS user_name, 
    registration_db.email, 
    dashboard.last_login
FROM registration_db
JOIN dashboard ON registration_db.id = dashboard.registration_id
WHERE DATE(dashboard.last_login) = CURDATE();

-- 9. Retrieve top 3 users by login count
SELECT 
    registration_db.name AS user_name, 
    dashboard.login_count
FROM registration_db
JOIN dashboard ON registration_db.id = dashboard.registration_id
ORDER BY dashboard.login_count DESC
LIMIT 3;

-- 10. Count total logins per user and rank them
SELECT 
     r.name as user_name,
     d.login_count,
     (SELECT COUNT(*)
     FROM dashboard d2
     WHERE d2.login_count>d.login_count)+1 AS user_rank
FROM registration_db r 
JOIN dashboard d on r.role=d.registration_id
ORDER BY user_rank;
-- Final select statements for validation
SELECT * FROM registration_db;
SELECT * FROM login_db;
SELECT * FROM dashboard;
