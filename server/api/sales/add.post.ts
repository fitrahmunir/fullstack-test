import { getIOInstance } from '~/server/plugins/socket.io'
export default defineEventHandler(async event => {
	const { productId, quantity } = await readBody(event)

	const io = getIOInstance()
	const newSales = await db().sale.create({
		data: {
			productId: productId,
			salesPersonId: 'e284044c-40ee-4785-89eb-049a378168e3',
			amount: parseInt(quantity),
		},
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
	.then((data) => {
		io.emit('newSalesData', {
			action: 'add',
			data
		})
	})

	return newSales
})
