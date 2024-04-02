const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Create a new PostgreSQL client
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'expense',
  password: 'goldie123',
  port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL server
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL server');
  })
  .catch(err => console.error('Error connecting to PostgreSQL server: ' + err.stack));

app.use(cors()); // Allow requests from all origins

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route to handle GET requests to fetch users
app.get('/users', (req, res) => {
  // Run query to fetch users
  client.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    // Send JSON response with query results
    res.json(result.rows);
  });
});

// Add API endpoint to fetch balance
app.get('/balance', (req, res) => {
    client.query('SELECT balance FROM users WHERE id = $1', [1], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).json({ error: 'Internal Server Error: ' + err.message });
            return;
        }
        res.json({ balance: result.rows[0].balance });
    });
});

// Add API endpoint to fetch savings (corrected endpoint path)
app.get('/savings', (req, res) => {
    client.query('SELECT saving FROM users WHERE id = $1', [1], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).json({ error: 'Internal Server Error: ' + err.message });
            return;
        }
        res.json({ savings: result.rows[0].saving }); // Changed from savings to saving
    });
});

// Add API endpoint to handle inserting into savings
app.post('/add-to-savings', (req, res) => {
  const { amount } = req.body;
  const userId = 1; // Assuming you have a single user for simplicity

  // Update user's savings and balance
  client.query(
      'UPDATE users SET saving = saving + $1, balance = balance - $1 WHERE id = $2 RETURNING *',
      [amount, userId],
      (err, result) => {
          if (err) {
              console.error('Error executing query: ' + err.stack);
              res.status(500).json({ error: 'Internal Server Error: ' + err.message });
              return;
          }
          res.json(result.rows[0]);
      }
  );
});

// Add API endpoint to handle taking out from savings
app.post('/take-from-savings', (req, res) => {
  const { amount } = req.body;
  const userId = 1; // Assuming you have a single user for simplicity

  // Update user's savings and balance
  client.query(
      'UPDATE users SET saving = saving - $1, balance = balance + $1 WHERE id = $2 RETURNING *',
      [amount, userId],
      (err, result) => {
          if (err) {
              console.error('Error executing query: ' + err.stack);
              res.status(500).json({ error: 'Internal Server Error: ' + err.message });
              return;
          }
          res.json(result.rows[0]);
      }
  );
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  client.end()
    .then(() => {
      console.log('Connection closed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing connection: ' + err.stack);
      process.exit(1);
    });
});
