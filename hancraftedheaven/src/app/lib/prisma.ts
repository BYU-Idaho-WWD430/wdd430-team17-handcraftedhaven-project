import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

// This block prevents multiple instances of the Prisma client
// from being created in the development environment due to hot-reloading.

declare global {
// Allows 'prisma' to exist on the global NodeJS object
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  // 1. Retrieve the database URL from environment variables.
  const connectionString = process.env.POSTGRES_PRISMA_URL;

  // 2. If the URL doesn't exist, throw a clear error instead of letting the app crash.
  if (!connectionString) {
    throw new Error("The environment variable POSTGRES_PRISMA_URL is not defined. Check your .env.local file.");
  }
  // 3. If the URL is not a string, throw a specific error.
  if (typeof connectionString !== "string") {
    throw new Error(`The environment variable POSTGRES_PRISMA_URL must be a string, but a value of type ${typeof connectionString} was received. Check the syntax in your .env.local file.`);
  }

  const neon = new Pool({ connectionString });
  const adapter = new PrismaNeon(neon);
  return new PrismaClient({ adapter });
};

const prisma = globalThis.prisma ?? createPrismaClient();

export default prisma;

// In development, store the Prisma client in the global scope
// to avoid creating multiple instances during hot-reloading.
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
 