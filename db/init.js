import pg from 'pg';

const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_LZ5H2AChwUGB@ep-sparkling-block-a4stnq97-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

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

const initDb = async () => {
  try {
    await pool.query(createTableQuery);
    console.log("✅ 'news' table created successfully.");
    
    // Insert some initial data if empty
    const checkCount = await pool.query('SELECT COUNT(*) FROM news');
    if (parseInt(checkCount.rows[0].count) === 0) {
        console.log("Inserting initial data...");
        const initialQuery = `
            INSERT INTO news (title, category, summary, content, image, date) VALUES 
            ('પી.એમ. કિસાન સન્માન નિધિ યોજના: 17મો હપ્તો ક્યારે આવશે?', 'ખેડૂત સમાચાર', 'પી.એમ. કિસાન યોજનાના 17મા હપ્તાની રાહ જોઈ રહેલા ખેડૂતો માટે મહત્વના સમાચાર.', 'પી.એમ. કિસાન યોજનાનો 17મો હપ્તો ટૂંક સમયમાં જમા થશે. eKYC કરાવવું ફરજિયાત છે.', 'https://ui-avatars.com/api/?name=PM+Kisan&background=16a34a&color=fff&size=128', '12 May 2024')
        `;
        await pool.query(initialQuery);
    }

  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    await pool.end();
  }
};

initDb();