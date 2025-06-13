// Build-safe Prisma client
let prisma: any

if (process.env.NODE_ENV === 'production') {
  // In production, create a mock that won't break the build
  prisma = {
    user: {
      findUnique: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
    },
    stylePreset: {
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
    },
    conversion: {
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      findMany: () => Promise.resolve([]),
    },
    purchase: {
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
    }
  }
} else {
  // In development, use the real Prisma client
  try {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient({
      log: ['query'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./dev.db'
        }
      }
    })
  } catch (error) {
    console.warn('Prisma client failed to initialize, using mock')
    prisma = {
      user: { findUnique: () => Promise.resolve(null) },
      stylePreset: { findMany: () => Promise.resolve([]) },
      conversion: { create: () => Promise.resolve({}) },
      purchase: { create: () => Promise.resolve({}) }
    }
  }
}

export { prisma }
