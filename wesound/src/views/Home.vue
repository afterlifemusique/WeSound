<script setup>
import {onMounted, watch} from "vue";
import { useITunes } from "../composables/useITunes";
import { usePlayer } from "../store/player";

const { songs, searchSongs } = useITunes();
const player = usePlayer();

onMounted(() => {
  searchSongs("bad bunny");
});

watch(songs, (newSongs) => {
  console.log("Songs updated:", newSongs.length);
  if (newSongs.length) {
    player.setPlaylist(newSongs);
  }
});

</script>

<template>
  <div class="home-page p-4">
    <h1 class="text-3xl font-bold mb-4">Home</h1>
    <p>Welcome to WeSound — your music remixing social app!</p>
  </div>

  <!-- Songs container -->
  <div class="songs-container flex flex-wrap gap-4">
    <button @click="player.play(song)" class="ml-auto text-xl song-item" v-for="song in songs" :key="song.id">
      <h1>{{ song.title }}</h1>
      <p>{{ song.artist }}</p>
      <p>{{ song.duration }}sec</p>
      <img :src="song.cover" :alt="song.title" width="80" />
    </button>
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