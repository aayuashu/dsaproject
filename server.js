// const express = require('express');
// const cors = require('cors');
// const connection = require('./db');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // ✅ Get all restaurants
// app.get('/restaurants', (req, res) => {
//   connection.query('SELECT * FROM restaurants ORDER BY rating DESC', (err, results) => {
//     if (err) {
//       res.status(500).send('Error retrieving restaurants');
//       return;
//     }
//     res.json(results);
//   });
// });

// // ✅ Add a new restaurant
// app.post('/restaurants', (req, res) => {
//   const { name, rating } = req.body;
//   if (!name || !rating) {
//     return res.status(400).json({ error: 'Name and rating are required' });
//   }

//   connection.query('INSERT INTO restaurants (name, rating, totalRatings) VALUES (?, ?, ?)', 
//     [name, rating, 1], (err, result) => {
//       if (err) {
//         res.status(500).send('Error adding restaurant');
//         return;
//       }
//       res.json({ id: result.insertId, name, rating, totalRatings: 1 });
//     });
// });

// // ✅ Update restaurant rating
// app.put('/restaurants/:id', (req, res) => {
//   const { id } = req.params;
//   const { rating } = req.body;

//   if (!rating) {
//     return res.status(400).json({ error: 'Rating is required' });
//   }

//   connection.query('SELECT rating, totalRatings FROM restaurants WHERE id = ?', [id], (err, results) => {
//     if (err || results.length === 0) {
//       res.status(500).send('Error finding restaurant');
//       return;
//     }

//     const currentRating = results[0].rating;
//     const currentTotalRatings = results[0].totalRatings;
//     const newRating = ((currentRating * currentTotalRatings) + rating) / (currentTotalRatings + 1);
//     const newTotalRatings = currentTotalRatings + 1;

//     connection.query('UPDATE restaurants SET rating = ?, totalRatings = ? WHERE id = ?', 
//       [newRating, newTotalRatings, id], (err) => {
//         if (err) {
//           res.status(500).send('Error updating restaurant');
//           return;
//         }
//         res.json({ id, newRating, newTotalRatings });
//       });
//   });
// });

// // ✅ Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });






// // //to run a simpler server
// // const express = require('express');
// // const app = express();

// // app.get('/', (req, res) => {
// //     res.send('Server is running!');
// // });

// // app.listen(3000, () => {
// //     console.log('Server is running on http://localhost:3000');
// // });

// server.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Allow cross-origin requests

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address
  user: 'root',           // MySQL username
  password: '',           // Your MySQL password
  database: 'restaurants' // Your MySQL database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

// API to get restaurant rankings
app.get('/api/restaurants', (req, res) => {
  const query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results); // Send restaurant data as response
  });
});

// API to add a new restaurant
app.post('/api/restaurants', (req, res) => {
  const { name, rating } = req.body;
  const query = 'INSERT INTO restaurants (name, rating, totalRatings) VALUES (?, ?, 1)';
  
  db.query(query, [name, rating], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Restaurant added successfully!' });
  });
});

// API to update restaurant rating
app.put('/api/restaurants/:id/rating', (req, res) => {
  const { id } = req.params;
  const { newRating } = req.body;

  // Get the current restaurant data
  db.query('SELECT rating, totalRatings FROM restaurants WHERE id = ?', [id], (err, results) => {
    if (err) throw err;

    const currentRating = results[0].rating;
    const totalRatings = results[0].totalRatings;

    // Calculate the updated rating
    const updatedRating = ((currentRating * totalRatings) + newRating) / (totalRatings + 1);

    // Update the rating in the database
    const query = 'UPDATE restaurants SET rating = ?, totalRatings = totalRatings + 1 WHERE id = ?';
    db.query(query, [updatedRating, id], (err, results) => {
      if (err) throw err;
      res.json({ message: 'Rating updated successfully!' });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
