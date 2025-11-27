<script setup>
import { onMounted } from "vue";
import { useITunes } from "../composables/useITunes";
import PlayerBar from "../components/PlayerBar.vue";

const { songs, searchSongs } = useITunes();

onMounted(() => {
  searchSongs("lofi");
});
</script>

<template>
  <div class="home-page p-4">
    <h1 class="text-3xl font-bold mb-4">Home</h1>
    <p>Welcome to WeSound — your music remixing social app!</p>
  </div>
  <div v-for="song in songs" :key="song.id" class="song-item">
    <div>
      <h1>{{ song.title }}</h1>
      <p>{{ song.artist }}</p>
      <p>{{ song.duration }}sec</p>
      <p>{{ song.url }}</p>
    </div>
    <img :src="song.cover" width="80" />
  </div>
</template>
