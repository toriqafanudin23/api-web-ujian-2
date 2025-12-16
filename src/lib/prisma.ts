import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`

console.log('Initializing Prisma client...');

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

console.log('Prisma client initialized successfully');

export { prisma }