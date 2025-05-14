<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { $socket, $socketInfo } = useNuxtApp()

const toast = useToast()

type Sale = {
	numId, int,
	id: string,
	productName: string,
	amount: number,
	salesPerson: string,
	salesDate: string
}

const salesList = ref([])

const { data, status } = await useFetch('/api/sales', {
	method: 'get',
	lazy: true,
})

const counter = ref(1)
function transformData(data) {
	return {
		numId: counter.value++,
		id: data.id,
		productId: data.product.id,
		productName: data.product.name,
		amount: data.amount,
		salesPerson: data.salesPerson.fullname,
		salesDate: data.updatedAt
	}
}

data.value.forEach(d => {
	salesList.value.push(transformData(d))
})

const columns: TableColumns<Sale>[] = [
	{
		accessorKey: 'numId',
		header: 'No.',
	},
	{
		accessorKey: 'productName',
		header: 'Nama Produk',
	},
	{
		accessorKey: 'amount',
		header: 'Quantity',
	},
	{
		accessorKey: 'salesPerson',
		header: 'Salesperson',
	},
	{
		accessorKey: 'salesDate',
		header: 'Date',
		cell: ({ row }) => {
			return new Date(row.original.salesDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			}).replace(' at ', ' ')
		}
	},
	{
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

const openModal = ref(false)
const salesData = ref({})

function getRowItems(row: Row<Sale>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      type: 'separator'
    },
    {
      label: 'Edit',
      onSelect() {
				openModal.value = true
				salesData.value = row.original
      }
    },
    {
      label: 'Delete',
			async onSelect() {
				const deleteSale = await useFetch('/api/sales/delete', {
					key: 'deletedSale',
					method: 'patch',
					body: {
						saleId: row.original.id,
					},
					onResponse({ request, response, options }) {
						toast.add({
						  title: 'Deleted!',
						  color: 'success',
						  icon: 'i-lucide-circle-check'
						})
					}
				})
      }
    }
  ]
}
console.log(columns)
function onClosedModal() {
	openModal.value = false;
}

onMounted(() => {
	$socket.on('newSalesData', ({ action, data }) => {
		counter.value = 1
		if (action === 'edit') {
			const updatedSales = {
				numId: 1,
				id: data.id,
				productId: data.product.id,
				productName: data.product.name,
				amount: data.amount,
				salesPerson: data.salesPerson.fullname,
				salesDate: data.updatedAt
			}
			salesList.value = [updatedSales, ...salesList.value.filter(sales => sales.id !== data.id)]
			
			salesList.value.map(data => data.numId = counter.value++)
		} else if (action === 'add') {
			const addSales = {
				numId: 1,
				id: data.id,
				productId: data.product.id,
				productName: data.product.name,
				amount: data.amount,
				salesPerson: data.salesPerson.fullname,
				salesDate: data.updatedAt
			}
			salesList.value = [addSales, ...salesList.value]
			
			salesList.value.map(data => data.numId = counter.value++)
		} else {
			salesList.value = [...salesList.value.filter(sales => sales.id !== data.id)]
			salesList.value.map(data => data.numId = counter.value++)
		}
	})
});
</script>

<template>
  <EditSaleModal :openModal="openModal" :saleData="salesData" @closedModal="onClosedModal" />
  <UTable :data="salesList" :columns="columns" :loading="status === 'pending'" class="flex-1" />
</template>

