<script setup>
import { usePlayer } from "../store/player";
import { useRouter } from "vue-router";
import HeartLike from "@/components/HeartLike.vue";

const player = usePlayer();
const router = useRouter();

async function changeSong(id) {
  if (!id) return;

  await router.replace(`/song/${id}`);

  setTimeout(() => {
    player.play();
  }, 50);
}

function removeSong(index) {
  player.playlist.splice(index, 1);

  // Adjust currentIndex if needed
  if (player.currentIndex >= index) {
    player.currentIndex = Math.max(player.currentIndex - 1, 0);
  }

  // Update the current track accordingly
  player.track = player.playlist[player.currentIndex] || null;

  if (player.track && player.audio) {
    player.audio.src = player.track.url;
    player.audio.load();
  }
}

</script>

<template>
  <div class="queue-wrapper">
    <div class="queue-label">
      <h3>Queue</h3>
    </div>
    <div class="queue">
      <ul class="queue-list">
        <li
            v-for="(song, index) in player.playlist"
            :key="song.id"
            class="queue-item"
            @click="changeSong(song.id)"
        >
          <span class="queue-number">{{ index + 1 }}</span>
          <img :src="song.artwork" class="queue-cover" />
          <div class="queue-info">
            <p class="queue-title">{{ song.title }}</p>
            <p class="queue-artist">{{ song.artist }}</p>
          </div>
          <div class="buttons">
            <HeartLike :song="song" @error="onLikeError" @update:liked="onLiked" />
            <button
                class="remove-btn"
                @click.stop="removeSong(index)"
                aria-label="Remove song"
            >
              &times;
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.queue-wrapper {
  overflow-y: auto;           /* enable its own scroll */
  padding-left: 20px;
  color: white;
  background: #121212;
  border-radius: 12px;

  max-height: 900px;
  min-height: 0;              /* required for flex scroll containers */
}

h3 {
  margin-top: 0;
  display: flex;
  justify-content: center;
}

.queue-label {
  padding-top: 20px;
  padding-bottom: 3px;
  font-size: 22px;
  font-weight: 700;
  position: sticky;
  top: 0;
  z-index: 10;
  background: transparent;
  width: 100px;
  left: 50%;
  transform: translateX(-50%);
}

.queue-wrapper::-webkit-scrollbar {
  width: 8px;
}

.queue-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.queue-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.queue-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
  cursor: pointer;
  height: 40px;
}

.queue-item:hover {
  background: rgba(255, 255, 255, 0.08);  /* Spotify hover glow */
}

.queue-number {
  width: 24px;
  text-align: right;
  opacity: 0.6;
  font-size: 14px;
}

.queue-info {
  display: flex;
  flex-direction: column;
}

.queue-title {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.queue-artist {
  margin: 0;
  font-size: 13px;
  opacity: 0.7;
}

.queue-cover {
  width: 40px;
}

 .buttons {
   margin-left: auto;
   display: flex;
 }

.remove-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  user-select: none;
}

.remove-btn:hover {
  opacity: 1;
}

</style>