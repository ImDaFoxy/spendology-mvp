const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL client configuration
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'expense',
  password: '',  // ensure correct password is used in actual deployment
  port: 5432,
});

// Connect to the PostgreSQL server
client.connect()
  .then(() => console.log('Connected to PostgreSQL server'))
  .catch(err => console.error('Error connecting to PostgreSQL server:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Endpoints
app.get('/users', (req, res) => {
  client.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(result.rows);
  });
});

app.get('/balance/:userId', (req, res) => {
  const userId = req.params.userId;
  client.query('SELECT balance FROM users WHERE id = $1', [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error: ' + err.message });
      return;
    }
    res.json({ balance: result.rows[0].balance });
  });
});

app.get('/savings/:userId', (req, res) => {
  const userId = req.params.userId;
  client.query('SELECT saving FROM users WHERE id = $1', [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error: ' + err.message });
      return;
    }
    res.json({ savings: result.rows[0].saving });
  });
});

app.get('/monthly-summary/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1
  const currentYear = currentDate.getFullYear();
  
  try {
    // Fetch sum of income for the current month
    const incomeResult = await client.query(
      'SELECT SUM(amount) AS total_income FROM transaction WHERE user_id = $1 AND type_id = 1 AND EXTRACT(MONTH FROM timestamp) = $2 AND EXTRACT(YEAR FROM timestamp) = $3',
      [userId, currentMonth, currentYear]
    );
    
    // Fetch sum of expense for the current month
    const expenseResult = await client.query(
      'SELECT SUM(amount) AS total_expense FROM transaction WHERE user_id = $1 AND type_id = 2 AND EXTRACT(MONTH FROM timestamp) = $2 AND EXTRACT(YEAR FROM timestamp) = $3',
      [userId, currentMonth, currentYear]
    );

    // Extract the sum of income and expense from the query results
    const totalIncome = incomeResult.rows[0].total_income || 0;
    const totalExpense = expenseResult.rows[0].total_expense || 0;

    res.json({ totalIncome, totalExpense });
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

app.get('/transactions/:userId', async (req, res) => {
  const userId = req.params.userId;

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
  const currentYear = currentDate.getFullYear();

  // Query to get transactions for the current month
  const query = `
    SELECT typess.name AS type, category.name AS category, amount
    FROM transaction
    JOIN typess ON transaction.type_id = typess.id
    JOIN category ON transaction.category_id = category.id
    WHERE user_id = $1
    AND EXTRACT(MONTH FROM timestamp) = $2
    AND EXTRACT(YEAR FROM timestamp) = $3
  `;

  try {
    const result = await client.query(query, [userId, currentMonth, currentYear]);
    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add-income/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { amount, category } = req.body;
  const typeId = 1; // Income type_id

  try {
    await client.query('BEGIN'); // Begin transaction

    // Update user's balance with the income amount
    const result = await client.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *',
      [amount, userId]
    );

    // Record the transaction
    await client.query(
      'INSERT INTO transaction (user_id, type_id, category_id, amount) VALUES ($1, $2, $3, $4)',
      [userId, typeId, category, amount]
    );

    await client.query('COMMIT'); // Commit transaction
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

app.post('/add-expense/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { amount, category } = req.body;
  const typeId = 2; // Expense type_id

  try {
    await client.query('BEGIN'); // Begin transaction

    // Update user's balance with the expense amount
    const result = await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING *',
      [amount, userId]
    );

    // Record the transaction
    await client.query(
      'INSERT INTO transaction (user_id, type_id, category_id, amount) VALUES ($1, $2, $3, $4)',
      [userId, typeId, category, amount]
    );

    await client.query('COMMIT'); // Commit transaction
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

app.post('/add-to-savings/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { amount } = req.body;
  const typeId = 3; // Savings type_id
  const categoryId = 8;

  try {
    await client.query('BEGIN'); // Begin transaction

    // Update user's savings only
    const result = await client.query(
      'UPDATE users SET saving = saving + $1, balance = balance - $1 WHERE id = $2 RETURNING *',
      [amount, userId]
    );

    // Record the transaction
    await client.query(
      'INSERT INTO transaction (user_id, type_id, category_id, amount) VALUES ($1, $2, $3, $4)',
      [userId, typeId, categoryId, amount]
    );

    await client.query('COMMIT'); // Commit transaction
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

app.post('/take-from-savings/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { amount } = req.body;
  const typeId = 3; // Savings type_id
  const categoryId = 9;

  try {
    await client.query('BEGIN'); // Begin transaction

    // Update user's savings only
    const result = await client.query(
      'UPDATE users SET saving = saving - $1, balance = balance + $1 WHERE id = $2 RETURNING *',
      [amount, userId]
    );

    // Record the transaction
    await client.query(
      'INSERT INTO transaction (user_id, type_id, category_id, amount) VALUES ($1, $2, $3, $4)',
      [userId, typeId, categoryId, amount]
    );

    await client.query('COMMIT'); // Commit transaction
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

// Sign up and Sign in routes
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (password === user.password) {
        res.json({ user });
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add API endpoint to fetch username
app.get('/username/:userId', (req, res) => {
  const userId = req.params.userId;
  client.query('SELECT name FROM users WHERE id = $1', [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error: ' + err.message });
      return;
    }
    res.json({ username: result.rows[0].name });
  });
});

// Add API endpoint to fetch user email
app.get('/email/:userId', (req, res) => {
  const userId = req.params.userId;
  client.query('SELECT email FROM users WHERE id = $1', [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error: ' + err.message });
      return;
    }
    res.json({ email: result.rows[0].email });
  });
});

// Server and Database Connection Closure
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  client.end()
    .then(() => {
      console.log('Connection to PostgreSQL closed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing connection:', err);
      process.exit(1);
    });
});
