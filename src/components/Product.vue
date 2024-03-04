<script setup lang="ts">
defineProps<{ product: Product }>()
const emits = defineEmits<{
  (e: 'hideProduct', id: Product['id']): void
  (e: 'editProduct', id: Product['id']): void
}>()

const user = JSON.parse(localStorage.getItem('user')||'{}')


function editProduct(id: Product['id']) {
  emits('editProduct', id)
}
function hideProduct(id: Product['id']) {
  emits('hideProduct', id)
}

</script>

<template>
  <el-card v-if="!product.is_hidden" class="relative border rounded-md">
    <img :src="product.photo" :alt="product.name">
    <template #footer>
      <div class="text-lg font-bold">{{ product.name }}</div>
      <div>Model: {{ product.model }}</div>
      <div>Category: {{ product.category }}</div>
      <div>Year of production: {{ product.year_of_production }}</div>
      <div class="truncate">Added at: {{ product.added_date }}</div>
      <div>Price: <span class="text-green-600 font-mono">{{ product.price }}$</span></div>
      <button
          v-if="user.type === 'user'"
          @click="hideProduct(product.id)"
          class="absolute top-6 right-6 bg-transparent hover:bg-black transition-all duration-200 ease-in-out p-1 rounded-md text-white bg-black"
      >
        Hide
      </button>
      <button
          v-else
          @click="editProduct(product.id)"
          class="absolute top-6 right-6 bg-transparent hover:bg-black transition-all duration-200 ease-in-out p-1 rounded-md text-white bg-black"
      >
        Edit
      </button>
    </template>
  </el-card>

</template>