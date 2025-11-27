<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Trending Songs</h1>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SongCard v-for="s in songs" :key="s.id" :song="s"/>
    </div>
  </div>
</template>

<script setup>
import SongCard from "../components/SongCard.vue";
import { fetchSongs } from "../api/songs.js";
import { ref, onMounted } from "vue";

const songs = ref([]);

onMounted(async () => {
  const { data } = await fetchSongs();
  songs.value = data;
});
</script>
