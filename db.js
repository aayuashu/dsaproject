require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // XAMPP default user
  password: '',       // No password for XAMPP (leave empty)
  database: 'restaurants'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

module.exports = connection;
