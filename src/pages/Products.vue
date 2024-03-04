<script setup lang="ts">
import {faker} from '@faker-js/faker';
import {onMounted, ref, watch} from "vue";
import Product from "@/components/Product.vue";
import {Field, Form, defineRule, configure} from 'vee-validate';
import {required, min} from "@vee-validate/rules";
import {debounce} from "lodash";


defineRule('required', required);
defineRule('min', min);

configure({
  generateMessage: (context) => `The field ${context.field} is ${context?.rule?.name}`,
});

const dialogVisible = ref(false);
const products = ref<Product[]>([]);
const filter = ref({title: '', categories: [] as string[]});
const selectedCategory = ref<string>();
const filteredProducts = ref<Product[]>([]);
const form = ref<{ [key: string]: any }>({})
const formFields = ref([
  {name: 'name', rules: 'required', label: 'Name'},
  {name: 'model', rules: 'required', label: 'Model'},
  {name: 'category', rules: 'required', label: 'Category'},
  {name: 'year_of_production', rules: 'required|min:4', label: 'Year of production'},
  {name: 'price', rules: 'required|min:1', label: 'Price'},
]);

function getRandomDate(start: Date, end: Date) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const month = String(date.getMonth() + 1).padStart(2, '0'); // pad with leading zero if necessary
  const year = date.getFullYear();
  return `${month}-${year}`;
}

function addProduct() {
  products.value.unshift({
    id: faker.string.uuid(),
    name: form.value.name,
    photo: faker.image.url(),
    model: form.value.model,
    year_of_production: form.value.year_of_production,
    category: form.value.category,
    price: form.value.price,
    added_date: getRandomDate(new Date(2020, 0, 1), new Date()),
    is_hidden: false
  })
  form.value = {};
  dialogVisible.value = false;
}

function editProduct(id: Product['id']) {
  const product = products.value.find((product) => product.id === id);
  if (product) {
    form.value = JSON.parse(JSON.stringify(product)); // create a deep copy of the product
    dialogVisible.value = true;
  }
}

function hideProduct(id: string) {
  const product = products.value.find((product) => product.id === id);
  if (product) product.is_hidden = true;
}


function createProduct(range: number = 10) {
  for (let i = 0; i < range; i++) {
    const product = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      photo: faker.image.url(),
      model: faker.commerce.productName(),
      year_of_production: faker.number.int({min: 2019, max: 2022}),
      category: faker.commerce.department(),
      price: faker.number.int({min: 99, max: 4999}),
      added_date: getRandomDate(new Date(2020, 0, 1), new Date()),
      is_hidden: false
    }
    products.value.push(product);
  }
  filteredProducts.value = products.value;
}

watch(() => filter.value.title, debounce((newVal: string) => {
  if (newVal === '') return (filteredProducts.value = products.value);
  filteredProducts.value = products.value.filter((product) => product.name.toLowerCase().includes(newVal.toLowerCase()));

}, 300))

onMounted(() => {
  createProduct()
  filter.value.categories = products.value.map((product) => product.category).filter((value, index, self) => self.indexOf(value) === index);
});
</script>

<template>
  <div class="p-10">
    <div class="flex justify-between py-3">
      <div class="flex justify-center space-x-1">
        <el-input v-model="filter.title" placeholder="Search" class="w-48"/>
        <el-select multiple clearable v-model="selectedCategory" placeholder="Categories">
          <el-option
              v-for="item in filter.categories"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-button plain @click="dialogVisible = true" class="px-2 border rounded-md">+</el-button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-4">
      <Product
          v-for="product in filteredProducts"
          :key="product.id"
          @editProduct="editProduct"
          @hide-product="hideProduct"
          :product/>
    </div>
  </div>
  <teleport to="body">
    <el-dialog class="!w-[32rem]" title="Add product" v-model="dialogVisible">
      <Form class="space-y-3" v-slot="{errors}">
        <Field
            v-for="field in formFields"
            :key="field.name"
            :name="field.name"
            :rules="field.rules"
            v-model="form[field.name]"
        >
          <template v-if="field.name === 'year_of_production'">
            <el-date-picker v-model="form[field.name]" type="year" value-format="YYYY"
                            placeholder="Select year"></el-date-picker>
          </template>
          <template v-else>
            <el-input :placeholder="field.label" v-model="form[field.name]"/>
          </template>
          <span class="text-red-600">{{ errors[field.name] }}</span>
        </Field>
      </Form>
      <template #footer>
        <el-button @click="addProduct">Add</el-button>
      </template>
    </el-dialog>
  </teleport>
</template>
