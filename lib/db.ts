import "server-only";
import { PrismaClient } from "@prisma/client";

// Standard Next.js dev-mode singleton guard - without this, every hot reload
// in `next dev` would open a fresh PrismaClient (and a fresh DB connection
// pool) on top of the last one.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
