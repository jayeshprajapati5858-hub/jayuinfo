
import { Pool, neonConfig } from '@neondatabase/serverless';

// Suppress the warning about running SQL from the browser
if (typeof window !== 'undefined' && neonConfig) {
  (neonConfig as any).disableWarningInBrowsers = true;
}

const connectionString = 'postgresql://neondb_owner:npg_N5Pl8HTUOywj@ep-still-wind-adtlfp21-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

export const pool = new Pool({ connectionString });
