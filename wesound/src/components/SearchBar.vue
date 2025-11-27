<script setup>
import { ref } from "vue";
import { useITunes } from "../composables/useITunes";

const { searchSongs, loading } = useITunes();
const query = ref("");

// Call searchSongs when user submits the form
const onSearch = (e) => {
  e.preventDefault();
  if (query.value.trim()) {
    searchSongs(query.value.trim());
  }
};
</script>

<template>
  <form @submit="onSearch" class="searchbar">
    <input
        type="text"
        v-model="query"
        placeholder="Search songs..."
        class="search-input"
        :disabled="loading"
    />
    <button type="submit" :disabled="loading" aria-label="Search">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="search-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="16.656" y1="16.657" x2="21" y2="21" />
      </svg>
    </button>
  </form>
</template>

<style scoped>
.searchbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #282828; /* Spotify dark background */
  border-radius: 4px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.5);
}

.search-input {
  flex-grow: 1;
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  font-size: 1em;
  color: white;
  background-color: #282828;
  transition: background-color 0.3s ease;
}

.search-input::placeholder {
  color: #b3b3b3;
}

.search-input:focus {
  outline: none;
  background-color: #474747;
  color: #c8c8c8;
}

button {
  background-color: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
}

button:hover {
  color: #8f6c28;
}

button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.search-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>