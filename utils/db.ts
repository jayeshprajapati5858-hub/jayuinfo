
import { Pool, neonConfig } from '@neondatabase/serverless';

// Suppress the warning about running SQL from the browser
if (typeof window !== 'undefined' && neonConfig) {
  (neonConfig as any).disableWarningInBrowsers = true;
}

const connectionString = 'postgresql://neondb_owner:npg_iIT2ytEBf6oS@ep-long-union-a4xgd19v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const cloudPool = new Pool({ connectionString });

export const pool = {
  query: async (text: string, params?: any[]) => {
    try {
      return await cloudPool.query(text, params);
    } catch (err: any) {
      console.warn("DB Query Error:", err.message);
      return { rows: [], rowCount: 0 };
    }
  }
};
