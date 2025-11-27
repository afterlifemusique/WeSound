#!/bin/bash

echo "🔥 Setting up WeSound project structure with boilerplate..."

# Create directories
mkdir -p src/{api,components,composables,layouts,router,store,views,assets/{img,css},utils}

#############################################
# API FILES
#############################################

cat > src/api/songs.js << 'EOF'
import { supabase } from "../composables/useSupabase";

export async function fetchSongs() {
  return supabase.from("songs").select("*").order("created_at", { ascending: false });
}

export async function likeSong(songId, userId) {
  return supabase.from("song_likes").insert({
    song_id: songId,
    user_id: userId
  });
}
EOF

cat > src/api/playlists.js << 'EOF'
import { supabase } from "../composables/useSupabase";

export async function createPlaylist(title, userId) {
  return supabase.from("playlists").insert({
    title,
    user_id: userId
  });
}

export async function addSongToPlaylist(playlistId, songId) {
  return supabase.from("playlist_songs").insert({ playlist_id: playlistId, song_id: songId });
}
EOF

cat > src/api/social.js << 'EOF'
import { supabase } from "../composables/useSupabase";

export async function createThread(userId, content) {
  return supabase.from("threads").insert({ user_id: userId, content });
}

export async function fetchThreads() {
  return supabase.from("threads").select("*, users(username, avatar_url)").order("created_at", { ascending: false });
}
EOF

cat > src/api/messages.js << 'EOF'
import { supabase } from "../composables/useSupabase";

export async function sendMessage(senderId, receiverId, content) {
  return supabase.from("messages").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    content
  });
}

export async function fetchMessages(a, b) {
  return supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${a},receiver_id.eq.${b}),and(sender_id.eq.${b},receiver_id.eq.${a})`)
    .order("created_at", { ascending: true });
}
EOF

cat > src/api/auth.js << 'EOF'
import { supabase } from "../composables/useSupabase";

export function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signUp(email, password) {
  return supabase.auth.signUp({ email, password });
}

export function signOut() {
  return supabase.auth.signOut();
}
EOF

#############################################
# COMPOSABLES
#############################################

cat > src/composables/useSupabase.js << 'EOF'
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
EOF

cat > src/composables/useAudioPlayer.js << 'EOF'
import { ref } from "vue";

export function useAudioPlayer() {
  const audio = new Audio();
  const playing = ref(false);
  const currentTrack = ref(null);

  function play(track) {
    if (!currentTrack.value || currentTrack.value.id !== track.id) {
      audio.src = track.audio_url;
      currentTrack.value = track;
    }
    audio.play();
    playing.value = true;
  }

  function pause() {
    audio.pause();
    playing.value = false;
  }

  return { audio, playing, currentTrack, play, pause };
}
EOF

cat > src/composables/useUser.js << 'EOF'
import { ref } from "vue";
import { supabase } from "./useSupabase";

export const currentUser = ref(null);

supabase.auth.onAuthStateChange((_event, session) => {
  currentUser.value = session?.user ?? null;
});
EOF

#############################################
# PINIA STORES
#############################################

cat > src/store/player.js << 'EOF'
import { defineStore } from "pinia";

export const usePlayer = defineStore("player", {
  state: () => ({
    audio: new Audio(),
    track: null,
    playing: false
  }),
  actions: {
    play(song) {
      if (!this.track || this.track.id !== song.id) {
        this.audio.src = song.audio_url;
        this.track = song;
      }
      this.audio.play();
      this.playing = true;
    },
    pause() {
      this.audio.pause();
      this.playing = false;
    }
  }
});
EOF

cat > src/store/user.js << 'EOF'
import { defineStore } from "pinia";
import { currentUser } from "../composables/useUser";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: currentUser
  })
});
EOF

#############################################
# COMPONENTS
#############################################

cat > src/components/PlayerBar.vue << 'EOF'
<template>
  <div v-if="track" class="fixed bottom-0 left-0 right-0 bg-black text-white p-3 flex items-center gap-4">
    <img :src="track.cover_url" class="w-12 h-12 rounded" />
    <div class="flex-1">
      <h3 class="font-semibold">{{ track.title }}</h3>
      <p class="text-sm opacity-70">{{ track.artist }}</p>
    </div>
    <button @click="toggle" class="text-xl">
      {{ playing ? "⏸" : "▶️" }}
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePlayer } from "../store/player";

const player = usePlayer();
const { track, playing } = storeToRefs(player);
const toggle = () => playing.value ? player.pause() : player.play(track.value);
</script>
EOF

cat > src/components/SongCard.vue << 'EOF'
<template>
  <div class="p-3 bg-white shadow rounded cursor-pointer" @click="player.play(song)">
    <img :src="song.cover_url" class="w-full rounded" />
    <h3 class="mt-2 font-semibold">{{ song.title }}</h3>
    <p class="text-sm text-gray-500">{{ song.artist }}</p>
  </div>
</template>

<script setup>
import { usePlayer } from "../store/player";
const props = defineProps({ song: Object });
const player = usePlayer();
</script>
EOF

cat > src/components/ThreadCard.vue << 'EOF'
<template>
  <div class="border-b p-4">
    <div class="flex items-center gap-2">
      <img :src="thread.users.avatar_url" class="w-8 h-8 rounded-full" />
      <strong>{{ thread.users.username }}</strong>
    </div>
    <p class="mt-2">{{ thread.content }}</p>
  </div>
</template>

<script setup>
defineProps({ thread: Object });
</script>
EOF

#############################################
# ROUTER
#############################################

cat > src/router/index.js << 'EOF'
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "Home", component: () => import("../views/Home.vue") },
  { path: "/feed", name: "Feed", component: () => import("../views/Feed.vue") },
  { path: "/messages", name: "Messages", component: () => import("../views/Messages.vue") },
  { path: "/profile/:id", name: "Profile", component: () => import("../views/Profile.vue") }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
EOF

#############################################
# VIEWS
#############################################

cat > src/views/Home.vue << 'EOF'
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Trending Songs</h1>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SongCard v-for="s in songs" :key="s.id" :song="s"/>
    </div>
  </div>
</template>

<script setup>
import SongCard from "../components/SongCard.vue";
import { fetchSongs } from "../api/songs";
import { ref, onMounted } from "vue";

const songs = ref([]);

onMounted(async () => {
  const { data } = await fetchSongs();
  songs.value = data;
});
</script>
EOF

echo "✅ WeSound boilerplate created successfully!"
