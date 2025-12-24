
import express from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' })); // Increased limit for base64 images

// Database Connection
const connectionString = 'postgresql://neondb_owner:npg_N5Pl8HTUOywj@ep-still-wind-adtlfp21-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize DB Tables Automatically on Startup
const initDb = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS notices (
      id SERIAL PRIMARY KEY,
      type TEXT,
      title TEXT,
      description TEXT,
      date_str TEXT,
      contact_person TEXT,
      mobile TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS marketplace (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      price TEXT NOT NULL,
      description TEXT,
      owner_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      date_str TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      date_str TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTablesQuery);
    client.release();
    console.log("✅ Database Connected & Tables Verified (Notices, Marketplace, News)");
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
  }
};

// Run Init
initDb();

app.get('/', (req, res) => {
  res.send('Backend API is Running.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
