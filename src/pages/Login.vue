<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const form = ref({
  username: '',
  password: ''
})

const users: { username: string; password: string; type: 'admin' | 'user' }[] = [
  {
    username: 'admin',
    password: 'admin',
    type: 'admin'
  },
  {
    username: 'user',
    password: 'user',
    type: 'user'
  }
]

function login() {
  const user = users.find(user => user.username === form.value.username && user.password === form.value.password)
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    router.push({name: 'Products'});
  } else {
    alert('Invalid username or password');
  }

}
</script>

<template>
  <div class="flex mt-52 items-center justify-center">
    <el-card>
      <template #header>
        <h2>Login</h2>
      </template>
      <el-input class="m-1" type="text" v-model="form.username" placeholder="Username"/>
      <el-input class="m-1" type="password" v-model="form.password" placeholder="Password"/>
      <template #footer>
        <el-button class="m-1" @click="login">Login</el-button>
      </template>
    </el-card>
  </div>
</template>