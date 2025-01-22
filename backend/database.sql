CREATE DATABASE IF NOT EXISTS Research_Hub;
USE Research_Hub;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS dashboard;
DROP TABLE IF EXISTS login_db;
DROP TABLE IF EXISTS registration_db;
DROP TABLE IF EXISTS papers;
DROP TABLE IF EXISTS favorites;

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
    FOREIGN KEY (registration_id) REFERENCES registration_db (id)
);

-- Create the dashboard table
CREATE TABLE dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    login_count INT DEFAULT 0,
    last_login TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (registration_id) REFERENCES registration_db (id)
);

-- Create the papers table with 'uploaded_by' field
CREATE TABLE papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    keywords VARCHAR(255) NOT NULL,
    pdf_path VARCHAR(255) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL DEFAULT 'unknown',  -- Ensure uploaded_by is a VARCHAR
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create the favorites table
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paper_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (paper_id) REFERENCES papers (id),
    FOREIGN KEY (user_id) REFERENCES registration_db (id)
);
-- Queries for data retrieval and complex operations:

-- 1. Update login data in the dashboard table
-- When a user logs in, update their login count and last login timestamp
UPDATE dashboard
SET
    login_count = login_count + 1,
    last_login = NOW()
WHERE
    registration_id = (
        SELECT id
        FROM registration_db
        WHERE
            email = '@gmail.com'
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
SELECT registration_db.name AS user_name, registration_db.email, dashboard.login_count
FROM registration_db
    JOIN dashboard ON registration_db.id = dashboard.registration_id
WHERE
    dashboard.login_count = (
        SELECT MAX(login_count)
        FROM dashboard
    );

-- 4. Retrieve users who have registered but never logged in
SELECT registration_db.*
FROM registration_db
WHERE
    registration_db.id NOT IN(
        SELECT registration_id
        FROM dashboard
    );

-- 5. Aggregate function: Count total users by role and logins
SELECT registration_db.role, COUNT(*) AS total_users, SUM(
        COALESCE(dashboard.login_count, 0)
    ) AS total_logins
FROM registration_db
    LEFT JOIN dashboard ON registration_db.id = dashboard.registration_id
GROUP BY
    registration_db.role;

-- 6. Retrieve login trends by role, with subquery to calculate average logins
SELECT
    registration_db.role,
    COUNT(dashboard.id) AS total_logins,
    MAX(dashboard.last_login) AS last_login,
    AVG(
        COALESCE(dashboard.login_count, 0)
    ) AS avg_logins
FROM registration_db
    LEFT JOIN dashboard ON registration_db.id = dashboard.registration_id
GROUP BY
    registration_db.role;

-- 7. Retrieve users with specific email domains who have logged in more than a certain number of times
SELECT registration_db.name AS user_name, registration_db.email, dashboard.login_count
FROM registration_db
    JOIN dashboard ON registration_db.id = dashboard.registration_id
WHERE
    registration_db.email LIKE '%@gmail.com%'
    AND dashboard.login_count > 1;

-- 8. Find users who logged in today
SELECT registration_db.name AS user_name, registration_db.email, dashboard.last_login
FROM registration_db
    JOIN dashboard ON registration_db.id = dashboard.registration_id
WHERE
    DATE(dashboard.last_login) = CURDATE();

-- 9. Retrieve top 3 users by login count
SELECT registration_db.name AS user_name, dashboard.login_count
FROM registration_db
    JOIN dashboard ON registration_db.id = dashboard.registration_id
ORDER BY dashboard.login_count DESC
LIMIT 3;

-- 10. Count total logins per user and rank them
SELECT r.name as user_name, d.login_count, (
        SELECT COUNT(*)
        FROM dashboard d2
        WHERE
            d2.login_count > d.login_count
    ) + 1 AS user_rank
FROM
    registration_db r
    JOIN dashboard d on r.role = d.registration_id
ORDER BY user_rank;
-- Final select statements for validation

-- 11. Retrieve a list of papers submitted, grouped by keywords
SELECT keywords, COUNT(*) AS paper_count
FROM papers
GROUP BY
    keywords
ORDER BY paper_count DESC;

-- 12. Retrieve the top 5 most frequently used keywords across all papers
SELECT keywords, COUNT(*) AS usage_count
FROM papers
GROUP BY
    keywords
ORDER BY usage_count DESC
LIMIT 2;

-- 13. Retrieve all papers authored by users with the most logins
SELECT p.title, p.abstract, r.name AS author_name, d.login_count
FROM
    papers p
    JOIN registration_db r ON r.id = p.id
    JOIN dashboard d ON d.registration_id = r.id
WHERE
    d.login_count = (
        SELECT MAX(login_count)
        FROM dashboard
    );

-- 14. Find the average number of logins per user for each role
SELECT r.role, AVG(COALESCE(d.login_count, 0)) AS avg_logins_per_user
FROM
    registration_db r
    LEFT JOIN dashboard d ON r.id = d.registration_id
GROUP BY
    r.role;

-- 15. Retrieve users who have never uploaded a paper
SELECT r.*
FROM registration_db r
WHERE
    NOT EXISTS (
        SELECT 1
        FROM papers p
        WHERE
            p.id = r.id
    );

-- 16. List all papers along with their authors' roles
SELECT
    p.title,
    p.abstract,
    r.name AS author_name,
    r.role AS author_role
FROM papers p
    JOIN registration_db r ON p.id = r.id;

-- 17. Retrieve login trends for the past week by role
SELECT r.role, COUNT(d.id) AS total_logins, AVG(d.login_count) AS avg_logins
FROM
    registration_db r
    LEFT JOIN dashboard d ON r.id = d.registration_id
WHERE
    d.last_login >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
GROUP BY
    r.role;

-- 18. Find the latest paper uploaded along with its author information
SELECT p.title, p.abstract, p.keywords, p.pdf_path, r.name AS author_name, r.email
FROM papers p
    JOIN registration_db r ON p.id = r.id
ORDER BY p.id DESC
LIMIT 1;

-- 19. Retrieve a count of papers authored by students vs. teachers
SELECT r.role, COUNT(p.id) AS total_papers
FROM registration_db r
    LEFT JOIN papers p ON r.id = p.id
GROUP BY
    r.role;

-- 20. Retrieve login activity for users who have uploaded at least one paper
SELECT r.name AS user_name, r.email, d.login_count, d.last_login
FROM
    registration_db r
    JOIN dashboard d ON r.id = d.registration_id
WHERE
    EXISTS (
        SELECT 1
        FROM papers p
        WHERE
            p.id = r.id
    );

SELECT
    title,
    abstract,
    CASE
        WHEN LENGTH(abstract) < 100 THEN 'Short'
        WHEN LENGTH(abstract) BETWEEN 100 AND 200  THEN 'Medium'
        ELSE 'Long'
    END AS abstract_length_category
FROM papers;

SELECT 
    f.id AS favorite_id,
    p.title AS paper_title,
    p.abstract,
    r.name AS author_name,
    r.email AS author_email
FROM 
    favorites f
JOIN 
    papers p ON f.paper_id = p.id
JOIN 
    registration_db r ON p.id = r.id
ORDER BY 
    f.id;


SELECT * FROM registration_db;

SELECT * FROM login_db;

SELECT * FROM dashboard;

SELECT * FROM papers;
SELECT * FROM favorites;

ALTER TABLE papers
ADD COLUMN upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;