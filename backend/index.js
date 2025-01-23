const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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
  const { title, abstract, keywords, uploaded_by } = req.body;  // Ensure uploaded_by is coming from req.body
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

app.get('/download/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId; // Assume userId is passed as a query parameter

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

    // Log the download in the download_logs table
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

app.post('/favorite', (req, res) => {
  const { paperId, userId } = req.body;
  const query = 'SELECT * FROM favorites WHERE paper_id = ? AND user_id = ?';
  db.query(query, [paperId, userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }

    if (results.length > 0) {
      const deleteQuery = 'DELETE FROM favorites WHERE paper_id = ? AND user_id = ?';
      db.query(deleteQuery, [paperId, userId], (err) => {
        if (err) {
          console.error('Error removing favorite:', err.message);
          return res.status(500).json({ success: false, message: 'Internal server error.' });
        }
        return res.json({ success: true, message: 'Paper unfavorited successfully' });
      });
    } else {
      const insertQuery = 'INSERT INTO favorites (paper_id, user_id) VALUES (?, ?)';
      db.query(insertQuery, [paperId, userId], (err) => {
        if (err) {
          console.error('Database query error:', err.message);
          return res.status(500).json({ success: false, message: 'Internal server error.' });
        }
        return res.json({ success: true, message: 'Paper favorited successfully' });
      });
    }
  });
});

// Route to fetch all papers
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
