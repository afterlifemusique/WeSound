<template>
  <div
      v-if="track"
      class="playerbar"
  >
    <img :src="track.cover" :alt="track.title" class="thumb" />

    <div class="info">
      <h3>{{ track.title }}</h3>
      <p>{{ track.artist }}</p>
    </div>

    <div class="controls">
      <button @click="player.restart()" class="control-btn">⏮</button>
      <button @click="toggle" class="control-btn">
        {{ playing ? "⏸" : "▶" }}
      </button>
      <button @click="player.next()" class="control-btn">⏭</button>
    </div>
  </div>
</template>


<script setup>
import { storeToRefs } from "pinia";
import { usePlayer } from "../store/player";

const player = usePlayer();
const { track, playing } = storeToRefs(player);

const toggle = () =>
    playing.value ? player.pause() : player.play();

</script>

<style scoped>
.playerbar {
  position: fixed;
  bottom: 0;
  left: 220px; /* align with your sidebar */
  right: 0;
  height: 64px;
  background: #f8f8f8;
  border-top: 1px solid #ddd;
  color: #111;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  z-index: 1000;
}

.thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
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
  color: #333;
  transition: color 0.15s;
}

.control-btn:hover {
  color: #000;
}
</style>