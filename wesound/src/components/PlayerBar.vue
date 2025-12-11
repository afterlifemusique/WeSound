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
        <img :src="track.artwork" :alt="track.title" class="thumb" />
      </button>
      <div class="info">
        <div class="title-container">
          <button
              @click="goToDetail"
              class="title-button"
          >
            <h3 class="scroll-text">{{ track.title }}</h3>
          </button>
        </div>
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
          @click="openQueueTab"
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

function openQueueTab() {
  if (!track.value) return;
  router.push({
    path: `/song/${track.value.id}/`,
    query: { tab: "queue" }
  });
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
  padding-left: 8px;
  gap: 8px;
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
}

.title-button{
  display: inline-flex;     /* instead of flex or block */
  justify-content: flex-start;
  background: transparent;
  cursor: pointer;
  border: none;
  padding: 0;
}

.scroll-text {
  white-space: nowrap;
  display: inline-block;
  position: relative;
  animation: none;           /* default: not moving */
}

.title-container {
  width: 140px;              /* limit how much space title can use */
  overflow: hidden;          /* hide overflow */
  position: relative;
}

/* Animate ONLY when the text is too long AND hovered */
.title-container:hover .scroll-text {
  animation: marquee 7s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%); /* adjust based on length */
  }
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
  color: #000;
  transition: color 0.15s;
  width: 40px;
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
  border-radius: 12px;
  text-decoration: none;
  background: transparent;
  color: black;
  font-weight: 600;
  transition: 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  right: 0;
  cursor: pointer;
}

.queue:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>