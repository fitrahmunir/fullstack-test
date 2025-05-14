<script setup lang="ts">
const open = ref(false)
const props = defineProps({
	title: {
		type: String,
		default: ''
	},
})
function closeModal() {
	open.value = true
}
</script>

<template>
	<UModal v-model:open="open" :title="title" :ui="{ footer: 'justify-end gap-4' }" dismissable="false" :close="false">
		<slot name="trigger" />

    <template #body>
			<slot name="body" />
    </template>

    <template #footer>
			<slot name="footer" />
    </template>
  </UModal>
</template>
