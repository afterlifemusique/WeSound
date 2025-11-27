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
  <div class="songs-container">
    <button
        v-for="song in songs"
        :key="song.id"
        @click="player.play(song)"
        class="song-item"
    >
      <img :src="song.cover" :alt="song.title" />

      <div class="song-meta">
        <h1>{{ song.title }}</h1>
        <p class="artist">{{ song.artist }}</p>
        <p class="duration">{{ song.duration }} sec</p>
      </div>
    </button>
  </div>

</template>

<style scoped>
.songs-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 120px; /* avoid overlapping with player bar */
}

/* Card */
.song-item {
  width: 200px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  text-align: left;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}

/* Hover effect like YouTube Studio cards */
.song-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

/* Thumbnail */
.song-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

/* Text styles */
.song-meta h1 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #111;
}

.song-meta .artist {
  font-size: 13px;
  color: #666;
  margin: 0 0 2px;
}

.song-meta .duration {
  font-size: 12px;
  color: #999;
  margin: 0;
}

</style>