<template>
  <div
      v-if="track"
      class="fixed bottom-0 left-0 right-0 bg-black text-white p-3 flex items-center gap-4"
  >
    <img :src="track.cover" :alt="track.title" class="w-12 h-12 rounded" />

    <div class="flex-1">
      <h3 class="font-semibold">{{ track.title }}</h3>
      <p class="text-sm opacity-70">{{ track.artist }}</p>
    </div>
    <button @click="restart" class="text-xl">
      {{ "⏮" }}
    </button>
    <button @click="toggle" class="text-xl">
      {{ playing ? "⏸" : "▶️" }}
    </button>
    <button @click="player.next" class="text-xl">
      {{ "⏭" }}
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePlayer } from "../store/player";

const player = usePlayer();
const { track, playing } = storeToRefs(player);

const toggle = () =>
    playing.value ? player.pause() : player.play();

const restart = () => {
  if (player.audio) {
    player.audio.currentTime = 0;
    player.audio.play();
    player.playing = true;
  }
};

const next = () => {

}
</script>
