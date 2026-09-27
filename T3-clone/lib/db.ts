import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
    prisma:PrismaClient | undefined
}

const pool = new Pool({
    connectionString:process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter:adapter
})

if(process.env.NODE_ENV !=="production"){
    globalForPrisma.prisma = prisma;
}
//ts has something hmr - hot module reload - which is why we have this globalForPrisma
//1. The Problem in Development (Hot Module Replacement / Fast Refresh)
//During next dev, whenever you edit and save a file, Next.js re-executes your modules (Hot Module Replacement / HMR).
// If you just do:
// export const prisma = new PrismaClient();
// This would create a brand new Prisma Client instance *every time* you save a file.
// Since your application can have many components rendering on the same page, you would end up with dozens of Prisma Clients open simultaneously.
// This leads to:
// Database Connection Limits: PostgreSQL has a limit on concurrent connections. You would quickly exhaust these limits.
// Memory Leaks: Each client holds onto memory and resources.
// Inefficient: You are constantly re-initializing your database connection pool.

// The Solution (Prisma's Recommended Pattern)
// The goal is to create the Prisma Client instance only ONCE and reuse it across your entire application. This is a singleton pattern.

// Why the Global Variable (globalForPrisma) is Needed
// TypeScript / JavaScript Modules and HMR:
// In development mode with Next.js (or Vite/Webpack), when you make a code change, the module is "hot-reloaded."
// "Hot-reload" means the file is re-executed, and a *new* instance of the module is created.
// So, without any special handling, every time the file is re-run, it would execute:
// const prisma = new PrismaClient();
// ...creating a new instance every time.
// To prevent this, we use the globalThis variable:
// globalThis is a special object that persists across hot-module-reload cycles in Node.js/Next.js.
// By checking if globalThis.prisma already exists, we ensure that the Prisma Client is initialized only once.
