<template>
  <div
      v-if="track"
      class="playerbar"
  >
    <div class="left-side">
      <button
          @click="goToDetail"
          class="thumb-button"
      >
        <img :src="track.cover" :alt="track.title" class="thumb" />
      </button>
      <div class="info">
        <h3>{{ track.title }}</h3>
        <p>{{ track.artist }}</p>
      </div>
    </div>
    <div class="middle">
      <div class="controls">
        <button @click="player.toggleMode()" class="control-btn">
          <span v-if="player.mode === 'repeat-one'" class="glyphicon glyphicon-play">🔂</span>
          <span v-else-if="player.mode === 'shuffle'">🔀</span>
          <span v-else>🔁</span>
        </button>
        <button @click="player.restart()" class="control-btn">⏮</button>
        <button @click="toggle" class="control-btn">
          {{ playing ? "⏸" : "▶" }}
        </button>
        <button @click="player.next()" class="control-btn">⏭</button>
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
    <div class="right-side">
      <button
          class="queue"
          :class="{ active: activeTab === 'queue' }"
          @click="setActiveTab('queue')"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <rect x="3" y="5" width="12" height="2" rx="1"/>
          <rect x="3" y="10" width="12" height="2" rx="1"/>
          <rect x="3" y="15" width="8"  height="2" rx="1"/>
          <polygon points="19,8 19,16 23,12" />
        </svg>
      </button>
    </div>

  </div>
</template>


<script setup>
import { storeToRefs } from "pinia";
import { usePlayer } from "../store/player";
import { useRouter } from "vue-router";
import HeartLike from "@/components/HeartLike.vue";

const router = useRouter();

const player = usePlayer();
const { track, playing } = storeToRefs(player);

const toggle = () =>
    playing.value ? player.pause() : player.play();

const formatTime = (sec) => {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

function goToDetail() {
  if (!track.value) return;
  router.push(`/song/${track.value.id}/`);
}
</script>

<style scoped>
.playerbar {
  position: fixed;
  bottom: 0;
  left: 700px;
  height: 64px;
  background: #f8f8f8;
  border-top: 1px solid #ddd;
  color: #111;
  display: flex;
  align-items: center;
  z-index: 1000;
  width: 35%;
  border-radius: 40px;
  justify-content: space-around;
}

/* LEFT */
.left-side {
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  left: 0;
  width: 25%;
}

.thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.thumb-button {
  background: gainsboro;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: 0.2s ease;
  border: none;
  right: 0;
  padding: 0;
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
  justify-content: left;
}

.info p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* MID */
.middle{
  width: 50%;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
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
  cursor: pointer;
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
  border: 1px solid #c8c8c8;
}

.time {
  font-size: 12px;
  opacity: 0.7;
}

/* RIGHT */
.right-side {
  margin-right: 20px;
}

.queue {
  padding: 12px 20px;
  background: #eaeaea;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  text-decoration: none;
  color: black;
  font-weight: 600;
  transition: 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  right: 0;
}
</style>