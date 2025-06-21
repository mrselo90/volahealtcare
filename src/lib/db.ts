import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connection pool optimization
if (process.env.NODE_ENV === 'production') {
  prisma.$connect();
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
export default prisma; 