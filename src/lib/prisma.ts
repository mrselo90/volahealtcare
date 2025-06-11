import { PrismaClient } from '@prisma/client';
import path from 'path';

const prismaClientSingleton = () => {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  return new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`
      }
    },
    log: ['error', 'warn']
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { prisma }; 