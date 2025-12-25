
import { Pool, neonConfig } from '@neondatabase/serverless';

// Suppress the warning about running SQL from the browser
if (typeof window !== 'undefined' && neonConfig) {
  (neonConfig as any).disableWarningInBrowsers = true;
}

const connectionString = 'postgresql://neondb_owner:npg_iIT2ytEBf6oS@ep-long-union-a4xgd19v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

const cloudPool = new Pool({ connectionString });

const schemaQuery = `
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
  CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY, 
    name TEXT, 
    category TEXT, 
    owner TEXT, 
    mobile TEXT, 
    details TEXT
  );
  CREATE TABLE IF NOT EXISTS water_schedule (
    id SERIAL PRIMARY KEY, 
    line_name TEXT, 
    area TEXT, 
    time_slot TEXT, 
    status TEXT
  );
  CREATE TABLE IF NOT EXISTS water_complaints (
    id SERIAL PRIMARY KEY, 
    name TEXT, 
    details TEXT, 
    date_str TEXT, 
    status TEXT
  );
  CREATE TABLE IF NOT EXISTS water_settings (
    key TEXT PRIMARY KEY, 
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS school_updates (
    id SERIAL PRIMARY KEY, 
    title TEXT, 
    date_str TEXT
  );
`;

// Track initialization state to prevent race conditions
let initPromise: Promise<any> | null = null;

export const pool = {
  query: async (text: string, params?: any[]) => {
    try {
      // If initialization is in progress, wait for it
      if (initPromise) {
        await initPromise;
      }
      return await cloudPool.query(text, params);
    } catch (err: any) {
      // Check if error is due to missing table (relation does not exist)
      if (err.message && (err.message.includes('relation') && err.message.includes('does not exist'))) {
          console.log("⚠️ Tables missing. Attempting to initialize database schema...");
          
          // Ensure only one initialization runs at a time
          if (!initPromise) {
             initPromise = cloudPool.query(schemaQuery)
                .then(() => {
                   console.log("✅ Database initialized.");
                   initPromise = null; // Clear promise on success
                })
                .catch((e) => {
                   console.error("❌ DB Init Failed", e);
                   initPromise = null; // Clear promise on error so we can retry
                   throw e;
                });
          }
          
          try {
              // Wait for the schema to be created
              await initPromise;
              // Retry the original query
              return await cloudPool.query(text, params);
          } catch (initErr: any) {
              console.error("❌ Query retry failed after init attempt.");
          }
      }

      console.warn("DB Operation Failed (Quota/Network):", err.message);
      // Return empty valid result to keep UI running in "Read-Only/Offline" mode
      return { rows: [], rowCount: 0 };
    }
  }
};
