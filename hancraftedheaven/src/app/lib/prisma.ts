import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

// Este bloque previene que se creen múltiples instancias del cliente de Prisma
// en el entorno de desarrollo debido a la recarga en caliente (hot-reloading).

declare global {
  // Permite que 'prisma' exista en el objeto global de NodeJS
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  // 1. Obtener la URL de la base de datos de las variables de entorno.
  const connectionString = process.env.POSTGRES_PRISMA_URL;

  // 2. Si la URL no existe, lanzar un error claro en lugar de dejar que la app crashee.
  if (!connectionString) {
    throw new Error("La variable de entorno POSTGRES_PRISMA_URL no está definida. Revisa tu archivo .env.local");
  }
  // 3. Si la URL no es una cadena de texto, lanzar un error específico.
  if (typeof connectionString !== "string") {
    throw new Error(`La variable de entorno POSTGRES_PRISMA_URL debe ser una cadena de texto (string), pero se recibió un tipo ${typeof connectionString}. Revisa la sintaxis en tu archivo .env.local`);
  }

  const neon = new Pool({ connectionString });
  const adapter = new PrismaNeon(neon);
  return new PrismaClient({ adapter });
};

const prisma = globalThis.prisma ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
 