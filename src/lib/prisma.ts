import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a safe Prisma client that handles build-time issues
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./dev.db'
        }
      }
    })
  } catch (error) {
    console.warn('Prisma client initialization failed, using mock client for build')
    // Return a mock client for build time
    return {} as PrismaClient
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
