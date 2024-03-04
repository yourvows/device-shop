<script setup lang="ts">
import {onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

onMounted(() => {
  const userItem = localStorage.getItem('user');
  const user = userItem ? JSON.parse(userItem) : null;
  if (user) {
    router.push({name: 'Products'});
  } else {
    router.push({name: 'Login'});
  }
})
</script>

<template>
  <router-view/>
</template>
