<template>
  <div
      class="playerbar"
  >
    <div class="controls">
      <button @click="player.toggleMode()" class="control-btn">
        <span v-if="player.mode === 'repeat-one'" class="glyphicon glyphicon-play">🔂</span>
        <span v-else-if="player.mode === 'shuffle'">🔀</span>
        <span v-else>🔁</span>
      </button>
      <button @click="handlePrevious" class="control-btn">⏮</button>
      <button @click="toggle" class="control-btn">
        {{ playing ? "⏸" : "▶" }}
      </button>
      <button @click="handleNext" class="control-btn">⏭</button>
      <HeartLike :song="song" @error="onLikeError" @update:liked="onLiked" />
    </div>
    <div class="progress-wrapper">
      <span class="time">{{ formatTime(player.currentTime) }}</span>
      <input
          type="range"
          class="progress-bar"
          :max="player.duration"
          :value="player.currentTime"
          @input="player.seekTo(Number($event.target.value))"
      />
      <span class="time">{{ formatTime(player.duration) }}</span>
    </div>
  </div>
</template>


<script setup>
import { storeToRefs } from "pinia";
import { usePlayer } from "../store/player";
import router from "../router/index.js";
import HeartLike from "@/components/HeartLike.vue";

const player = usePlayer();
const { playing, track } = storeToRefs(player);

const toggle = () =>
    playing.value ? player.pause() : player.play();

async function handlePrevious() {
  player.restart();

  await router.replace(`/song/${track.value.id}`);

  setTimeout(() => {
    player.play();
  }, 50);
}

async function handleNext() {
  player.next();

  await router.replace(`/song/${track.value.id}`);

  setTimeout(() => {
    player.play();
  }, 50);
}

const formatTime = (sec) => {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

function onLikeError(e) { console.error(e); }
// optional: react to like change
function onLiked(val) { /* update local state if needed */ }
</script>

<style scoped>
.playerbar {
  position: relative;
  height: 64px;
  background: transparent;
  color: #111;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  z-index: 1000;
}

.info h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.info p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  font-size: 20px;
  padding: 6px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #ffffff;
  transition: color 0.15s;
}

.control-btn:hover {
  color: #000;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.progress-bar {
  flex: 1;
  height: 4px;
  appearance: none;
  background: #ccc;
  border-radius: 2px;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
}

.time {
  font-size: 12px;
  opacity: 0.7;
  color: #aaa;
}
</style>