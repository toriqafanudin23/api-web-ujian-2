import "dotenv/config";
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const prisma = new PrismaClient({
  datasourceUrl: connectionString
})

console.log('Prisma client initialized successfully');

export { prisma }