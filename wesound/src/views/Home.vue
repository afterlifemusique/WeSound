<script setup>
import { onMounted } from "vue";
import { useITunes } from "../composables/useITunes";
import { usePlayer } from "../store/player";

const { songs, searchSongs } = useITunes();
const player = usePlayer();

onMounted(() => {
  searchSongs("lofi");
});
</script>

<template>
  <div class="home-page p-4">
    <h1 class="text-3xl font-bold mb-4">Home</h1>
    <p>Welcome to WeSound — your music remixing social app!</p>
  </div>

  <!-- Songs container -->
  <div class="songs-container flex flex-wrap gap-4">
    <div v-for="song in songs" :key="song.id" class="song-item">
      <div>
        <h1>{{ song.title }}</h1>
        <p>{{ song.artist }}</p>
        <p>{{ song.duration }}sec</p>
      </div>
      <img :src="song.cover" :alt="song.title" width="80" />
      <button @click="player.play(song)" class="ml-auto text-xl">▶️</button>
    </div>
  </div>
</template>

<style scoped>
.songs-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* space between items */
}

.song-item {
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>