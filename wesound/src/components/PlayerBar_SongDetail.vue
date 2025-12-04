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
    </div>
  </div>
</template>


<script setup>
import { storeToRefs } from "pinia";
import { usePlayer } from "../store/player";
import router from "../router/index.js";

const player = usePlayer();
const { playing, track } = storeToRefs(player);

const toggle = () =>
    playing.value ? player.pause() : player.play();

function handlePrevious() {
  player.restart()
  router.replace(`/song/${track.value.id}`);
}

function handleNext() {
  player.next()
  router.replace(`/song/${track.value.id}`);
}
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
</style>