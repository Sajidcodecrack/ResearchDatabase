const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sajid123456',
  database: 'Research_Hub',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Database connected!');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'INSERT INTO login_db (email, password) VALUES (?, ?)';

  db.query(query, [email, password], (err, result) => {
    if (err) throw err;
    res.json({ success: true, message: 'User logged in' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
