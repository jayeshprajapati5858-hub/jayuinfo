// @ts-ignore
import { Pool } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_LZ5H2AChwUGB@ep-sparkling-block-a4stnq97-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

export const pool = new Pool({ connectionString });
