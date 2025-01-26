const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sajid123456',
  database: 'Research_Hub',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('Database connected!');
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Registration endpoint
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

    const countQuery = `
      SELECT 
        SUM(CASE WHEN role = 'Student' THEN 1 ELSE 0 END) AS students,
        SUM(CASE WHEN role = 'Teacher' THEN 1 ELSE 0 END) AS teachers
      FROM registration_db;
    `;
    db.query(countQuery, (err, results) => {
      if (err) {
        console.error('Error fetching user counts:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
      }

      const { students, teachers } = results[0];
      return res.json({ success: true, message: 'User registration successful.', students, teachers });
    });
  });
});

// Login endpoint
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

// Endpoint to fetch user counts
app.get('/user-counts', (req, res) => {
  const query = `
    SELECT 
      SUM(CASE WHEN role = 'Student' THEN 1 ELSE 0 END) AS students,
      SUM(CASE WHEN role = 'Teacher' THEN 1 ELSE 0 END) AS teachers
    FROM registration_db;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }

    if (results.length > 0) {
      const { students, teachers } = results[0];
      return res.json({ success: true, students, teachers });
    } else {
      return res.json({ success: true, students: 0, teachers: 0 });
    }
  });
});

// Verify password endpoint
app.post('/verifyPassword', (req, res) => {
  const { role, password } = req.body;

  if (!role || !password) {
    return res.status(400).json({ success: false, message: 'Role and password are required.' });
  }

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

// Endpoint for students to upload papers
app.post('/upload', upload.single('pdf'), (req, res) => {
  const { title, abstract, keywords, uploaded_by } = req.body;
  const pdfPath = req.file.path;

  const query = 'INSERT INTO papers (title, abstract, keywords, pdf_path, uploaded_by) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [title, abstract, keywords, pdfPath, uploaded_by], (err, result) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
    res.json({ success: true, message: 'Research paper uploaded successfully' });
  });
});

// Endpoint for teachers to upload papers
app.post('/Tpaperlist', upload.single('pdf'), (req, res) => {
  const { title, abstract, keywords, uploaded_by } = req.body;
  const pdfPath = req.file.path;

  const query = 'INSERT INTO papers (title, abstract, keywords, pdf_path, uploaded_by) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [title, abstract, keywords, pdfPath, uploaded_by], (err, result) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
    res.json({ success: true, message: 'Research paper uploaded successfully' });
  });
});

// Endpoint to download papers
app.get('/download/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId;

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

    const logQuery = 'INSERT INTO download_logs (user_id, paper_id) VALUES (?, ?)';
    db.query(logQuery, [userId, id], (logErr) => {
      if (logErr) {
        console.error('Error logging download:', logErr.message);
      }
      res.download(pdfPath, (downloadErr) => {
        if (downloadErr) {
          console.error('Error downloading file:', downloadErr.message);
          res.status(500).json({ success: false, message: 'Internal server error.' });
        }
      });
    });
  });
});

// Endpoint to fetch all papers
app.get('/papers', (req, res) => {
  const query = 'SELECT * FROM papers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
    res.json(results);
  });
});

// Endpoint to search papers
app.get('/search', (req, res) => {
  const { query } = req.query;
  const searchQuery = `
    SELECT * FROM papers 
    WHERE title LIKE ? 
    OR keywords LIKE ? 
    OR uploaded_by LIKE ?
  `;
  const likeQuery = `%${query}%`;

  db.query(searchQuery, [likeQuery, likeQuery, likeQuery], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});