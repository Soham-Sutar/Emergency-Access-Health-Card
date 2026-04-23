import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

// basic root and health endpoints
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running. Use /api/... endpoints.' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// auth routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const result = await pool.query('SELECT id, username, created_at FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    return res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username', [username, password]);
    return res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === '23505') return res.status(400).json({ error: 'Username already exists' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// catch-all for undefined routes (nice JSON 404)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// start server
const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
