import { defineConfig, type Config } from 'drizzle-kit';

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  },
  verbose: true,
  strict: true,
  dialect: "postgresql",
}) satisfies Config