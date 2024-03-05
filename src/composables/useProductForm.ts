import { ref } from 'vue'
import { faker } from '@faker-js/faker'

type IProductForm = Omit<IProduct, 'id' | 'photo' | 'is_hidden'>

export function useProduct() {
  const products = ref<IProduct[]>([])
  const productFormFields = [
    { name: 'name', rules: 'required', label: 'Name' },
    { name: 'model', rules: 'required', label: 'Model' },
    { name: 'category', rules: 'required', label: 'Category' },
    { name: 'year_of_production', rules: 'required|min:4', label: 'Year of production' },
    { name: 'price', rules: 'required|min:1', label: 'Price' },
  ]

  function getRandomDate(start: Date, end: Date) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}-${year}`
  }

  function addProduct(item: IProductForm | IProduct, type: string = 'add') {
    if (type === 'add') {
      const product = {
        ...item,
        id: faker.string.uuid(),
        photo: faker.image.url(),
        is_hidden: false,
      }
      products.value.unshift(product)
    } else {
      const index = products.value.findIndex((product) => product.id === (item as IProduct).id)
      products.value[index] = item as IProduct
    }
  }

  function createProduct(range: number = 20) {
    for (let i = 0; i < range; i++) {
      const product = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        photo: faker.image.url(),
        model: faker.commerce.productName(),
        year_of_production: faker.number.int({ min: 2019, max: 2022 }),
        category: faker.commerce.department(),
        price: faker.number.int({ min: 99, max: 4999 }),
        added_date: getRandomDate(new Date(2020, 0, 1), new Date()),
        is_hidden: false,
      }
      products.value.push(product)
    }
  }

  return {
    products,
    productFormFields,
    addProduct,
    createProduct,
  }
}
