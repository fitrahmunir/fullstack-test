import { getIOInstance } from '~/server/plugins/socket.io'

export default defineEventHandler(async event => {
	const { saleId } = await readBody(event)
	
	const io = getIOInstance()
	const deletedSales = await db().sale.update({
		where: {
			id: saleId,
		},
		data: {
			isDeleted: true
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
			action: 'delete',
			data
		})
	})

	return deletedSales
})
