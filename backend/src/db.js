// src/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

/**
 * A single shared connection pool for the whole app. Every route imports
 * `pool` from here and calls pool.query(...) — Neon (and Postgres in
 * general) handles concurrent queries fine over a pool, so there's no need
 * to open/close a connection per request.
 *
 * `ssl: { rejectUnauthorized: false }` is required for Neon's hosted
 * connection — it uses SSL, but the exact CA chain isn't always bundled
 * in Node's default trust store, so this relaxes just the certificate
 * authority check (the connection itself is still encrypted).
 */
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle Postgres client", err);
});