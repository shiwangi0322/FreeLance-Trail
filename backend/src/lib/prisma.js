// src/lib/prisma.js
import { PrismaClient } from "@prisma/client";

/**
 * A single shared Prisma Client instance for the whole app. Every
 * controller imports `prisma` from here instead of creating its own
 * `new PrismaClient()` — creating multiple instances during development
 * (especially with nodemon restarting the process) can exhaust your
 * database's connection limit, which matters on Neon's free tier.
 */
export const prisma = new PrismaClient();