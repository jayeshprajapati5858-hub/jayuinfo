
import express from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Database Connection
const connectionString = 'postgresql://neondb_owner:npg_iIT2ytEBf6oS@ep-long-union-a4xgd19v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Init DB (Clean Slate)
const initDb = async () => {
  const cleanQuery = `
    DROP TABLE IF EXISTS notices CASCADE;
    DROP TABLE IF EXISTS jobs CASCADE;
    DROP TABLE IF EXISTS marketplace CASCADE;
    DROP TABLE IF EXISTS news CASCADE;
    DROP TABLE IF EXISTS businesses CASCADE;
    DROP TABLE IF EXISTS water_schedule CASCADE;
    DROP TABLE IF EXISTS water_complaints CASCADE;
    DROP TABLE IF EXISTS water_settings CASCADE;
    DROP TABLE IF EXISTS school_updates CASCADE;
    DROP TABLE IF EXISTS beneficiaries CASCADE;
    DROP TABLE IF EXISTS news_articles CASCADE;
  `;
  try {
    const client = await pool.connect();
    await client.query(cleanQuery);
    client.release();
    console.log("✅ Database Cleaned. Ready for new website.");
  } catch (err) {
    console.error("❌ DB Connection/Clean Error:", err);
  }
};

initDb();

app.get('/', (req, res) => {
  res.send('Website Cleaned. Database Reset Complete.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
