
import express from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectionString = 'postgresql://neondb_owner:npg_N5Pl8HTUOywj@ep-still-wind-adtlfp21-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize DB Table Automatically on Startup
const initDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      date TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log("✅ Database Connected & Table Verified");
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
  }
};

// Run Init
initDb();

// Root route
app.get('/', (req, res) => {
  res.send('Backend API is Running. Access /api/news for data.');
});

// GET: Fetch all news
app.get('/api/news', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ error: 'Database error fetching news' });
  }
});

// POST: Add new news
app.post('/api/news', async (req, res) => {
  const { title, category, summary, content, image, date } = req.body;
  
  try {
    const query = `
      INSERT INTO news (title, category, summary, content, image, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, category, summary, content, image, date];
    const result = await pool.query(query, values);
    
    console.log("Saved News Item ID:", result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving news:", err);
    res.status(500).json({ error: 'Failed to save news to database' });
  }
});

// DELETE: Remove news
app.delete('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM news WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error("Error deleting news:", err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
