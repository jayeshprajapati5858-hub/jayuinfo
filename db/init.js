
import pg from 'pg';

const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_N5Pl8HTUOywj@ep-still-wind-adtlfp21-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTableQuery = `
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

  CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY, 
    category TEXT, 
    title TEXT, 
    details TEXT, 
    wages TEXT, 
    contact_name TEXT, 
    mobile TEXT, 
    date_str TEXT
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

const initDb = async () => {
  try {
    await pool.query(createTableQuery);
    console.log("✅ Tables verified (notices, jobs, marketplace, news).");
  } catch (err) {
    console.error("❌ Database Init Error:", err);
  } finally {
    await pool.end();
  }
};

initDb();
