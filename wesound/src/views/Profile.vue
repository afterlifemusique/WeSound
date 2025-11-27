<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const userId = route.params.id;
</script>

<template>
  <div class="profile-page p-4">
    <h1 class="text-3xl font-bold mb-4">Profile: {{ userId }}</h1>
    <p>This is the user profile page.</p>
  </div>
</template>
