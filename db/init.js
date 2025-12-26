
import pg from 'pg';

const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_iIT2ytEBf6oS@ep-long-union-a4xgd19v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// COMMAND TO CLEAN ALL DATABASE TABLES
const cleanDbQuery = `
  DROP TABLE IF EXISTS notices CASCADE;
  DROP TABLE IF EXISTS jobs CASCADE;
  DROP TABLE IF EXISTS marketplace CASCADE;
  DROP TABLE IF EXISTS news CASCADE;
  DROP TABLE IF EXISTS news_articles CASCADE;
  DROP TABLE IF EXISTS businesses CASCADE;
  DROP TABLE IF EXISTS water_schedule CASCADE;
  DROP TABLE IF EXISTS water_complaints CASCADE;
  DROP TABLE IF EXISTS water_settings CASCADE;
  DROP TABLE IF EXISTS school_updates CASCADE;
  DROP TABLE IF EXISTS beneficiaries CASCADE;
`;

const initDb = async () => {
  try {
    console.log("🧹 Cleaning Database...");
    await pool.query(cleanDbQuery);
    console.log("✅ Database Cleaned! All old tables deleted.");
    console.log("🚀 Ready for new DB schema.");
  } catch (err) {
    console.error("❌ Database Clean Error:", err);
  } finally {
    await pool.end();
  }
};

initDb();
