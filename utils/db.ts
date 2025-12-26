
import { Pool, neonConfig } from '@neondatabase/serverless';

// Suppress the warning about running SQL from the browser
if (typeof window !== 'undefined' && neonConfig) {
  (neonConfig as any).disableWarningInBrowsers = true;
}

const connectionString = 'postgresql://neondb_owner:npg_iIT2ytEBf6oS@ep-long-union-a4xgd19v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const cloudPool = new Pool({ connectionString });

// Only one table needed for the News Portal
const schemaQuery = `
  CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    author TEXT,
    views INTEGER DEFAULT 0,
    is_breaking BOOLEAN DEFAULT FALSE,
    date_str TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

let initPromise: Promise<any> | null = null;

export const pool = {
  query: async (text: string, params?: any[]) => {
    try {
      if (initPromise) await initPromise;
      return await cloudPool.query(text, params);
    } catch (err: any) {
      if (err.message && (err.message.includes('relation') && err.message.includes('does not exist'))) {
          console.log("⚠️ News table missing. Initializing new database schema...");
          
          if (!initPromise) {
             initPromise = cloudPool.query(schemaQuery)
                .then(() => {
                   console.log("✅ News Database initialized.");
                   initPromise = null;
                })
                .catch((e) => {
                   console.error("❌ DB Init Failed", e);
                   initPromise = null;
                   throw e;
                });
          }
          
          try {
              await initPromise;
              return await cloudPool.query(text, params);
          } catch (initErr: any) {
              console.error("❌ Retry failed.");
          }
      }
      console.warn("DB Operation Failed:", err.message);
      return { rows: [], rowCount: 0 };
    }
  }
};
