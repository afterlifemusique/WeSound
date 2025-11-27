<template>
  <div class="p-3 bg-white shadow rounded cursor-pointer" @click="player.play(song)">
    <img :src="song.cover_url" class="w-full rounded" />
    <h3 class="mt-2 font-semibold">{{ song.title }}</h3>
    <p class="text-sm text-gray-500">{{ song.artist }}</p>
  </div>
</template>

<script setup>
import { usePlayer } from "../store/player.js";
const props = defineProps({ song: Object });
const player = usePlayer();
</script>
