// migrations/run.js
// Run with: npm run migrate
// Reads 001_init.sql and executes it against DATABASE_URL. Safe to re-run —
// every statement uses CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

async function runMigration() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    const sqlPath = path.join(__dirname, "001_init.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    console.log("Running migration: 001_init.sql ...");
    try {
        await pool.query(sql);
        console.log("✔ Migration completed successfully.");
    } catch (err) {
        console.error("✘ Migration failed:", err.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

runMigration();