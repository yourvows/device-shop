<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { Field, Form, defineRule, configure } from 'vee-validate'
  import { required, min } from '@vee-validate/rules'
  import { debounce } from 'lodash'
  import { useProduct } from '@/composables/useProductForm.ts'
  import Product from '@/components/Product.vue'

  type IProductForm = Omit<IProduct, 'id' | 'photo' | 'is_hidden'> & { [key: string]: any }

  defineRule('required', required)
  defineRule('min', min)

  configure({
    generateMessage: (context) => `The field ${context.field} is ${context?.rule?.name}`,
  })

  const { products, productFormFields, addProduct, createProduct } = useProduct()
  const dialogVisible = ref(false)

  const filter = ref({ title: '', categories: [] as string[] })
  const selectedCategory = ref<string[]>([])
  const filteredProducts = ref<IProduct[]>([])
  const form = ref<IProductForm>({
    name: '',
    price: 0,
    model: '',
    year_of_production: 2020,
    category: '',
    added_date: '',
  })

  function editProduct(id: IProduct['id']) {
    const product = products.value.find((product) => product.id === id)
    if (product) {
      form.value = JSON.parse(JSON.stringify(product)) // create a deep copy of the product
      dialogVisible.value = true
    }
  }

  function hideProduct(id: string) {
    const product = products.value.find((product) => product.id === id)
    if (product) product.is_hidden = true
  }

  watch(
    () => filter.value.title,
    debounce((newVal: string) => {
      if (newVal === '') return (filteredProducts.value = products.value)
      filteredProducts.value = products.value.filter((product) =>
        product.name.toLowerCase().includes(newVal.toLowerCase()),
      )
    }, 300),
  )
  watch(
  () => selectedCategory.value,
  (newVal: string[]) => {
    if (!newVal.length) {
      filteredProducts.value = products.value;
    } else {
      filteredProducts.value = products.value.filter((product) =>
        newVal.includes(product.category)
      );
    }
  }
);

  onMounted(() => {
    createProduct()
    filteredProducts.value = products.value
    filter.value.categories = products.value
      .map((product) => product.category)
      .filter((value, index, self) => self.indexOf(value) === index)
  })
</script>

<template>
  <div class="p-10">
    <div class="flex justify-between py-3">
      <div class="flex justify-center space-x-1">
        <el-input v-model="filter.title" placeholder="Search" class="w-48" />
        <el-select multiple clearable v-model="selectedCategory" placeholder="Categories">
          <el-option v-for="item in filter.categories" :key="item" :label="item" :value="item"/>
        </el-select>
      </div>
      <div>
        <el-button plain @click="dialogVisible = true" class="px-2 border rounded-md">+</el-button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Product
        v-for="product in filteredProducts"
        :key="product.id"
        @editProduct="editProduct($event)"
        @hide-product="hideProduct($event)"
        :product
      />
    </div>
  </div>
  <teleport to="body">
    <el-dialog class="!w-[32rem]" title="Add product" v-model="dialogVisible">
      <Form class="space-y-3" v-slot="{ errors }">
        <Field
          v-for="field in productFormFields"
          :key="field.name"
          :name="field.name"
          :rules="field.rules"
          v-model="form[field.name]"
        >
          <template v-if="field.name === 'year_of_production'">
            <el-date-picker
              v-model="form[field.name]"
              type="year"
              value-format="YYYY"
              placeholder="Select year"
            />
          </template>
          <template v-else>
            <el-input :placeholder="field.label" v-model="form[field.name]" />
          </template>
          <span class="text-red-600">{{ errors[field.name] }}</span>
        </Field>
      </Form>
      <template #footer>
        <el-button @click="addProduct(form)">Add</el-button>
      </template>
    </el-dialog>
  </teleport>
</template>
