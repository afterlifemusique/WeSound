<script setup>
defineProps({
  songs: Array
});
</script>

<template>
  <div v-if="songs.length" class="songs-grid">
    <div v-for="song in songs" :key="song.id" class="song-card">
      <div class="song-artwork">
        <img
            v-if="song.artwork_url"
            :src="song.artwork_url"
            :alt="song.title"
        />
        <div v-else class="artwork-placeholder">🎵</div>
      </div>
      <div class="song-info">
        <h3 class="song-title">{{ song.title }}</h3>
        <p class="song-artist">{{ song.artist }}</p>
      </div>
    </div>
  </div>
  <p v-else class="placeholder-text">No songs yet</p>
</template>

<style scoped>
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.song-card {
  background: #3a3a3a;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.song-card:hover {
  transform: translateY(-4px);
}

.song-artwork {
  width: 100%;
  aspect-ratio: 1;
  background: #4a4a4a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.song-artwork img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artwork-placeholder {
  font-size: 48px;
}

.song-info {
  padding: 12px;
}

.song-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 13px;
  color: #888;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.placeholder-text {
  color: #888;
  font-size: 16px;
  text-align: center;
  padding: 60px 20px;
}
</style>