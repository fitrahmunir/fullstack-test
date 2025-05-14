export default defineEventHandler(async event => {
	const sales = await db().sale.findMany({
		relationLoadStrategy: 'join',
		where: {
			isDeleted: false,
		},
		orderBy: [
			{
				updatedAt: 'desc'
			}
		],
		select: {
			id: true,
			product: {
				select: {
					id: true,
					name: true,
				}
			},
			salesPerson: {
				select: {
					id: true,
					fullname: true,
				}
			},
			amount: true,
			updatedAt: true
		}
	})

	return sales;
})
