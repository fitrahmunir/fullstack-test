<script setup lang="ts">
	import Modal from '/components/Modal'
	import type { FormError, FormSubmitEvent } from '@nuxt/ui'

	const isOpen = ref(false)

	const state = reactive({
		selectedProduct: undefined,
		quantity: undefined
	})

	const validate = (state: any): FormError[] => {
		const errors = []
		if (!state.selectedProduct) errors.push({ name: 'product', message: 'Required' })
		if (!state.quantity) errors.push({ name: 'quantity', message: 'Required' })
		return errors
	}

	const { data, status } = await useFetch('/api/products', {
		method: 'get',
		key: 'productList',
		transform: (response) => {
			return response.map(product => ({
				label: product.name,
				value: product.id
			}))
		},
		lazy: true,
	})

	const products = ref(data)

	const toast = useToast()
	async function onSubmit(event: FormSubmitEvent<typeof state>) {
		event.preventDefault();
		const newSale = await useFetch('/api/sales/add', {
			method: 'post',
			body: {
				productId: event.data.selectedProduct.value,
				quantity: event.data.quantity,
			},
			onResponse({ request, response, options }) {
				toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
				event.data.selectedProduct = undefined
				event.data.quantity = undefined
			}
		})
	}
</script>

<template>
	<div class="flex w-full justify-end my-6 px-4">
			<Modal :open="isOpen" title="Create a New Sale Data">
				<template #trigger>
						<UButton trailing-icon="i-lucide-plus" size="xl" color="neutral" variant="outline" @click="isOpen = true">New</UButton>
				</template>
				<template #body>
					<UForm ref="saleForm" :validate="validate" :state="state" class="flex flex-col gap-y-4" @submit="onSubmit">
						<UFormField label="Product" name="product">
							<USelectMenu v-model="state.selectedProduct" size="xl" :items="products" class="w-full" />
						</UFormField>

						<UFormField label="Quantity" name="quantity">
							<UInput v-model="state.quantity" size="xl" class="w-full" />
						</UFormField>
					</UForm>
				</template>
				<template #footer>
					<UButton size="lg" color="error" variant="soft" @click="isOpen = false">Cancel</UButton>
					<UButton size="lg" color="primary" variant="soft" @click="$refs.saleForm.submit(); isOpen = false">Add</UButton>
				</template>
			</Modal>
	</div>
</template>
