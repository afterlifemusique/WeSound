<script setup>
import { watch, computed, ref, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";

import { useITunes } from "./composables/useITunes";
import { usePlayer } from "./store/player";
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';

import PlayerBar from "./components/PlayerBar.vue";
import SearchBar from "./components/SearchBar.vue";
import Account from "@/components/Account.vue";
import SignInRedirect from "@/components/SignInRedirect.vue";

const route = useRoute();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const isLoggedIn = computed(() => !!user.value);

// --- NEW: Account Switching Logic ---
const isSwitching = ref(sessionStorage.getItem('is_switching_account') === 'true');

onMounted(() => {
  if (isSwitching.value) {
    // Wait for Supabase to re-hydrate the session after the reload
    setTimeout(() => {
      sessionStorage.removeItem('is_switching_account');
      isSwitching.value = false;
    }, 1000); // 1 second buffer
  }
});

const { songs, searchSongs, loading } = useITunes();
const player = usePlayer();

const handleSearch = (query) => {
  searchSongs(query);
};

watch(songs, (newSongs) => {
  if (newSongs.length) {
    player.setPlaylist(newSongs);
  }
});
</script>

<template>
  <div class="app-layout">
    <header class="app-header p-4 bg-gray-900">
      <SearchBar :loading="loading" @search="handleSearch" />
    </header>

    <nav class="sidebar">
      <router-link to="/" class="logo">WS</router-link>

      <div class="auth-wrapper">
        <div v-if="isSwitching" class="switching-loader">
          <div class="spinner"></div>
        </div>

        <template v-else>
          <Account v-if="isLoggedIn" />
          <SignInRedirect v-else />
        </template>
      </div>

      <router-link to="/" class="nav-item">Home</router-link>
      <router-link to="/feed" class="nav-item">Feed</router-link>
      <router-link to="/messages" class="nav-item">Messages</router-link>
    </nav>

    <main class="main-content">
      <RouterView :songs="songs" />
    </main>

    <PlayerBar v-if="!route.path.startsWith('/song/')" />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, #6b6b6b 0%, #000000 100%);
  color: white;
}
</style>
<style scoped>
/* Main Page */
.app-layout, #app {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  color: white;
}

/* Search Bar */
.app-header {
  position: fixed;
  top: 15px;
  left: 140px;
  right: 1050px;
  z-index: 9999;
}

/* Sidebar layout */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  background: #121212;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: white;
  z-index: 9999;
}

/* Sidebar items */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  color: #b3b3b3;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.2s ease;
}

/* Hover effect */
.nav-item:hover {
  background: #272727;
  color: white;
}

/* Active link (router-link-active) */
.nav-item.router-link-active {
  background: #8f6c28;
  color: black;
  font-weight: bold;
}

/* Logo */
.logo {
  font-size: 32px; /* Bigger font for the logo */
  color: #ffffff;
  text-decoration: solid;
  font-weight: bold;
}


/* Page content pushed right */
.main-content {
  margin-left: 140px;
  padding: 20px 0;
  padding-top: 80px; /* header height */
  padding-bottom: 80px; /* player height */
  height: calc(100vh - 60px - 60px); /* viewport minus header + player */
  overflow-y: auto;
}

.auth-wrapper {
  margin-bottom: 12px;
  min-height: 48px; /* Prevents layout jump */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Switching State Styles */
.switching-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #b8860b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
