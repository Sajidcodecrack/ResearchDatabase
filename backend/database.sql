CREATE DATABASE IF NOT EXISTS Research_Hub;
-- DROP DATABASE Research_Hub;
USE Research_Hub;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS dashboard;

DROP TABLE IF EXISTS login_db;

DROP TABLE IF EXISTS registration_db;

DROP TABLE IF EXISTS papers;

DROP TABLE IF EXISTS favorites;

DROP Table IF EXISTS download_logs;

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
    uploaded_by VARCHAR(255) NOT NULL DEFAULT 'unknown', -- Ensure uploaded_by is a VARCHAR
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

-- 7. Retrieve users with specific email domains who have logged in more than a certain number of times
SELECT registration_db.name AS user_name, registration_db.email, dashboard.login_count
FROM registration_db
    JOIN dashboard ON registration_db.id = dashboard.registration_id
WHERE
    registration_db.email LIKE '%gmail.com%'
    AND dashboard.login_count > 0;

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

-- 16. List all papers along with their authors' roles
SELECT
    p.title,
    p.abstract,
    r.name AS author_name,
    r.role AS author_role
FROM papers p
    JOIN registration_db r ON p.id = r.id;

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

SELECT
    title,
    abstract,
    CASE
        WHEN LENGTH(abstract) < 100 THEN 'Short'
        WHEN LENGTH(abstract) BETWEEN 100 AND 200  THEN 'Medium'
        ELSE 'Long'
    END AS abstract_length_category
FROM papers;
--  favourute paper list from user
SELECT
    f.id AS favorite_id,
    p.title AS paper_title,
    p.abstract,
    r.name AS author_name,
    r.email AS author_email
FROM
    favorites f
    JOIN papers p ON f.paper_id = p.id
    JOIN registration_db r ON p.id = r.id
ORDER BY f.id;

-- some complex quries for paper and favorites
SELECT uploaded_by, COUNT(*) AS total_papers
FROM papers
GROUP BY
    uploaded_by
ORDER BY total_papers DESC;
-- 2
SELECT keywords, COUNT(*) AS usage_count
FROM papers
GROUP BY
    keywords
ORDER BY usage_count DESC
LIMIT 5;
-- 3 average papers
SELECT
    uploaded_by,
    AVG(paper_count) AS avg_papers_per_user
FROM (
        SELECT uploaded_by, COUNT(*) AS paper_count
        FROM papers
        GROUP BY
            uploaded_by
    ) AS subquery
GROUP BY
    uploaded_by;
-- 4 who have most favoritied papers
SELECT registration_db.name AS user_name, COUNT(favorites.id) AS total_favorites
FROM registration_db
    LEFT JOIN favorites ON registration_db.id = favorites.user_id
GROUP BY
    registration_db.name
HAVING
    total_favorites = (
        SELECT MAX(total_favorites)
        FROM (
                SELECT user_id, COUNT(*) AS total_favorites
                FROM favorites
                GROUP BY
                    user_id
            ) AS subquery
    );
-- 5 Ranking papers
SELECT papers.title, papers.abstract, COUNT(favorites.id) AS total_favorites
FROM papers
    LEFT JOIN favorites ON papers.id = favorites.paper_id
GROUP BY
    papers.title,
    papers.abstract
ORDER BY total_favorites DESC;
-- Average length of abstracts
SELECT keywords, AVG(LENGTH(abstract)) AS avg_abstract_length
FROM papers
GROUP BY
    keywords
ORDER BY avg_abstract_length DESC;
-- Retrive the most recent paper
SELECT
    uploaded_by,
    MAX(upload_time) AS last_uploaded_time,
    title,
    abstract,
    keywords
FROM papers
GROUP BY
    uploaded_by,
    title,
    abstract,
    keywords
ORDER BY last_uploaded_time DESC;
-- Retrive who have favorited at least one paper
SELECT registration_db.name AS user_name, COUNT(favorites.id) AS total_favorites
FROM registration_db
    LEFT JOIN favorites ON registration_db.id = favorites.user_id
WHERE
    favorites.id IS NOT NULL
GROUP BY
    registration_db.name
ORDER BY total_favorites DESC;
-- Retrieve the trend of the recent papers in 7 days
SELECT
    DATE(upload_time) AS upload_date,
    COUNT(*) AS daily_upload_count
FROM papers
WHERE
    upload_time >= CURDATE() - INTERVAL 7 DAY
GROUP BY
    upload_date
ORDER BY upload_date DESC;

SELECT * FROM registration_db;

SELECT * FROM login_db;

SELECT * FROM dashboard;

SELECT * FROM papers;

SELECT * FROM favorites;