const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sajid123456', // Replace with your MySQL password
  database: 'Research_Hub',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('Database connected!');
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const query = 'SELECT * FROM registration_db WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }

    if (results.length > 0) {
      // User found, insert login attempt into login_db
      const registrationId = results[0].id;
      const loginQuery = 'INSERT INTO login_db (email, password, registration_id) VALUES (?, ?, ?)';

      db.query(loginQuery, [email, password, registrationId], (err) => {
        if (err) {
          console.error('Error inserting login record:', err.message);
          return res.status(500).json({ success: false, message: 'Internal server error.' });
        }

        return res.json({ success: true, message: 'User login successful.' });
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  });
});

// Register route
app.post('/register', (req, res) => {
  const { name, email, age, password } = req.body;

  // Validate request body
  if (!name || !email || !age || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const query = 'INSERT INTO registration_db (name, email, age, password) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, age, password], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Email already exists.' });
      }
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }

    return res.json({ success: true, message: 'User registration successful.' });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
