<script setup>
import { ref } from 'vue';

const props = defineProps({
  songs: Array,
  isOwnProfile: Boolean,
  uploading: Boolean,
  deletingId: [String, Number]
});

const emit = defineEmits(['upload-song', 'delete-song', 'play-song']);

const fileInput = ref(null);

function handleFileChange(event) {
  emit('upload-song', event.target.files[0]);
}

function handleDelete(event, songId) {
  event.stopPropagation();
  event.preventDefault();

  if (props.deletingId) return;
  if (!confirm('Delete this song?')) return;

  emit('delete-song', songId);
}

function handlePlaySong(song) {
  emit('play-song', song);
}
</script>

<template>
  <div>
    <!-- Upload Button for Own Profile -->
    <div v-if="isOwnProfile" class="upload-section">
      <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          accept="audio/mp3,audio/wav,audio/mpeg"
          style="display: none"
      />
      <button @click="fileInput.click()" class="upload-btn" :disabled="uploading">
        {{ uploading ? 'Uploading...' : '🎵 Post Music' }}
      </button>
    </div>

    <div v-if="songs.length" class="songs-grid">
      <div
          v-for="song in songs"
          :key="song.id"
          class="song-card"
          @click="handlePlaySong(song)"
      >
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

        <!-- Delete Button (only for own profile) -->
        <button
            v-if="isOwnProfile"
            @click="handleDelete($event, song.id)"
            class="delete-btn"
            :disabled="deletingId === song.id"
            :title="deletingId === song.id ? 'Deleting...' : 'Delete song'"
        >
          <span v-if="deletingId === song.id">⏳</span>
          <span v-else>🗑️</span>
        </button>
      </div>
    </div>
    <p v-else class="placeholder-text">No songs yet</p>
  </div>
</template>

<style scoped>
.upload-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.upload-btn {
  padding: 12px 32px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: #b8860b;
  color: #fff;
}

.upload-btn:hover:not(:disabled) {
  background: #9a7009;
}

.upload-btn:disabled {
  background: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

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
  position: relative;
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

/* Delete Button */
.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
}

.song-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.delete-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.delete-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.placeholder-text {
  color: #888;
  font-size: 16px;
  text-align: center;
  padding: 60px 20px;
}
</style>