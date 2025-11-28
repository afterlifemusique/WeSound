<template>
  <button @click="logout">Logout</button>
</template>

<script setup>
import { signOut } from "../api/auth.js";
import { useUserStore } from "../stores/user.js";

const userStore = useUserStore();

async function logout() {
  await signOut();
  // userStore.user will be cleared automatically due to watcher
}
</script>