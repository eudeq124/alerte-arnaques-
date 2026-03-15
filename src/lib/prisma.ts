import { PrismaClient } from "@prisma/client";

// Singleton pattern — avoid multiple instances during dev hot-reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (!globalForPrisma.prisma) {
      console.log("Prisma Client initialization (Lazy)...");
      globalForPrisma.prisma = new PrismaClient();
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});
