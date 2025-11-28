<template>
  <form @submit.prevent="login">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit" :disabled="loading">Login</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { signIn } from "../api/auth.js";
import { useUserStore } from "../stores/user.js";

const email = ref("");
const password = ref("");
const error = ref(null);
const loading = ref(false);

const userStore = useUserStore();

async function login() {
  loading.value = true;
  error.value = null;

  const { data, error: signInError } = await signIn(email.value, password.value);

  if (signInError) {
    error.value = signInError.message;
  } else {
    // userStore.user will update automatically due to watcher in store
  }

  loading.value = false;
}
</script>