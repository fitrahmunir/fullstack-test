import { getIOInstance } from '~/server/plugins/socket.io'

export default defineEventHandler(async event => {
	const { saleId, productId, quantity } = await readBody(event)

	const io = getIOInstance()
	const editedSales = await db().sale.update({
		where: {
			id: saleId,
		},
		data: {
			productId,
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
			action: 'edit',
			data
		})
	})

	return editedSales
})
