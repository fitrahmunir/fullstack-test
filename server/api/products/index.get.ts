export default defineEventHandler(async event => {
	const product = await db().product.findMany({
		where: {
			isDeleted: false,
		},
		select: {
			id: true,
			name: true,
			stock: true,
			updatedAt: true
		}
	})

	return product;
})
