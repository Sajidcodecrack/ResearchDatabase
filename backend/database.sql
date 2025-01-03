CREATE DATABASE Research_Hub;

USE Research_Hub;
DROP TABLE login_db;

CREATE TABLE login_db (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
SELECT * FROM login_db;