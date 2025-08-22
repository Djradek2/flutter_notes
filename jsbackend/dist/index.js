import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import postgres from 'postgres';
const db = drizzle(process.env.DATABASE_URL);
//# sourceMappingURL=index.js.map