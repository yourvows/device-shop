<script setup lang="ts">
  import { ref } from 'vue'
  import { Tools } from '@element-plus/icons-vue'

  defineProps<{ product: IProduct }>()

  const emits = defineEmits<{
    (e: 'hideProduct', id: IProduct['id']): void
    (e: 'editProduct', id: IProduct): void
    (e: 'deleteProduct', id: IProduct['id']): void
  }>()

  const activeNames = ref(['0'])
  const handleChange = (val: any) => {
    activeNames.value = val
  }

  function deleteProduct(product: IProduct) {
    emits('deleteProduct', product.id)
  }
  function editProduct(product: IProduct) {
    emits('editProduct', product)
  }

  function hideProduct(product: IProduct) {
    emits('hideProduct', product.id)
  }

  const eventHandlers = {
    hideProduct,
    editProduct,
    deleteProduct,
  }
</script>

<template>
  <el-card v-if="!product.is_hidden" class="relative rounded-md">
    <template #header>
      <div class="text-lg font-bold">{{ product.name }}</div>
      <div>Model: {{ product.model }}</div>
      <div class="bg-black w-fit rounded-full px-1 text-white">{{ product.category }}</div>
    </template>
    <img :src="product.photo" :alt="product.name" />
    <template #footer class="!border-0">
      <div>
        Price: <span class="text-green-600 font-mono">{{ product.price }}$</span>
      </div>
      <el-collapse class="!border-0" v-model="activeNames" @change="handleChange">
        <el-collapse-item class="!border-0" title="Description" name="1">
          <div>
            {{ product.description }}
          </div>
          <div>Year of production: {{ product.year_of_production }}</div>
          <div class="truncate">Added at: {{ product.added_date }}</div>
        </el-collapse-item>
      </el-collapse>
      <div class="absolute top-6 right-6">
        <el-dropdown class="focus-visible:ring-0 border-0 focus-visible:border-0">
          <span class="el-dropdown-link">
            <el-icon class="el-icon--right">
              <tools />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(handler, eventName) in eventHandlers"
                @click="handler(product)"
                :key="eventName"
                >{{ eventName }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </el-card>
</template>

<style lang="postcss">
  .el-collapse-item__header {
    @apply !border-0;
  }
</style>