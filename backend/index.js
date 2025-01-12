const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

const upload = multer({ storage: storage });

// Verify password route of dashboard
app.post('/verifyPassword', (req, res) => {
  const { role, password } = req.body;

  const query = 'SELECT * FROM registration_db WHERE role = ? AND password = ?';
  db.query(query, [role, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }

    if (results.length > 0) {
      return res.json({ success: true, message: 'Password verified.' });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

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
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const query = 'INSERT INTO registration_db (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, password, role], (err) => {
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

// Upload research paper route
app.post('/upload', upload.single('pdf'), (req, res) => {
  const { title, abstract, keywords } = req.body;
  const pdfPath = req.file.path;

  const query = 'INSERT INTO papers (title, abstract, keywords, pdf_path) VALUES (?, ?, ?, ?)';
  db.query(query, [title, abstract, keywords, pdfPath], (err, result) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
    res.json({ success: true, message: 'Research paper uploaded successfully' });
  });
});

// Download research paper route
app.get('/download/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT pdf_path FROM papers WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Paper not found.' });
    }

    const pdfPath = results[0].pdf_path;
    res.download(pdfPath, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
