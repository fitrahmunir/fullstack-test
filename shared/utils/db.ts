import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

export default () => {
	const connectionString = `${process.env.DATABASE_URL}`

	const adapter = new PrismaPg({ connectionString });
	const prisma = new PrismaClient({ adapter });

	return prisma
}
