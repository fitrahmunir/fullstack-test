<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import type { FormError, FormSubmitEvent } from '@nuxt/ui'
	import Modal from '/components/Modal'

	const props = defineProps({
		openModal: Boolean,
		saleData: Object,
	});

	const state = reactive({
		saleId: undefined,
		selectedProduct: undefined,
		quantity: undefined,
		isOpen: false
	})

	onMounted(() => {
		if (props.openModal) {
			state.isOpen = props.openModal;
		}
		if (props.saleData) {
			state.saleId = props.saleData.id;
			state.selectedProduct = {
				label: props.saleData.productName,
				value: props.saleData.productId
			};
			state.quantity = props.saleData.amount;
		}
	});

	watch(() => props.openModal, (openModal) => {
		if (openModal) {
			state.isOpen = openModal;
		} else {
			state.isOpen = openModal;
		}
	});

	watch(() => props.saleData, (newSaleData) => {
		if (newSaleData) {
			state.saleId = props.saleData.id;
			state.selectedProduct = {
				label: newSaleData.productName,
				value: newSaleData.productId
			};
			state.quantity = newSaleData.amount;
		} else {
			// Reset state if saleData is cleared
			state.saleId = undefined;
			state.selectedProduct = undefined;
			state.quantity = undefined;
		}
	});

	const validate = (state: any): FormError[] => {
		const errors = []
		if (!state.selectedProduct) errors.push({ name: 'product', message: 'Required' })
		if (!state.quantity) errors.push({ name: 'quantity', message: 'Required' })
		return errors
	}

	const { data, status } = await useFetch('/api/products', {
		method: 'get',
		transform: (response) => {
			return response.map(product => ({
				label: product.name,
				value: product.id
			}))
		},
		lazy: true
	})

	const products = ref(data)

	const toast = useToast()
	async function onSubmit(event: FormSubmitEvent<typeof state>) {
		const newSale = await useFetch('/api/sales/edit', {
			method: 'put',
			body: {
				saleId: event.data.saleId,
				productId: event.data.selectedProduct.value,
				quantity: event.data.quantity,
			},
			onResponse({ request, response, options }) {
				toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
			}
		})
	}
	const emit = defineEmits(['closedModal']);
	function closeModal() {
		state.isOpen = false;
		emit('closedModal', true);
	}
</script>

<template>
	<div class="flex w-full justify-end">
			<Modal :open="state.isOpen" title="Edit Sale Data">
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
					<UButton size="lg" color="error" variant="solid" @click="closeModal">Cancel</UButton>
					<UButton size="lg" color="primary" variant="solid" @click="$refs.saleForm.submit(); closeModal()">Add</UButton>
				</template>
			</Modal>
	</div>
</template>
