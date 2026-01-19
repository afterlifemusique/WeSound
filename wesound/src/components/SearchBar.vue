<script setup>
import { ref } from "vue";

const emit = defineEmits(["search"]);
const { loading } = defineProps({ loading: Boolean });

const query = ref("");

const onSearch = (e) => {
  e.preventDefault();
  if (query.value.trim()) {
    emit("search", query.value.trim());
  }
};
</script>

<template>
  <form @submit.prevent="onSearch" class="search-container">
    <input
        type="text"
        v-model="query"
        placeholder="Search..."
        class="search-input"
    />
  </form>
</template>

<style scoped>
.search-container {
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 25px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input::placeholder {
  color: #888;
}

.search-input:focus {
  border-color: #666;
}
</style>