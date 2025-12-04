<script setup>
import { watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import PlayerBar from "./components/PlayerBar.vue";
import SearchBar from "./components/SearchBar.vue";

import { useITunes } from "./composables/useITunes";
import { usePlayer } from "./store/player";

const route = useRoute();

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
    <!-- Search Bar -->
    <header class="app-header p-4 bg-gray-900">
      <SearchBar :loading="loading" @search="handleSearch" />
    </header>

    <!-- Navigation Sidebar -->
    <nav class="sidebar">
      <router-link to="/" class="logo">WeSound</router-link>
      <router-link to="/" class="nav-item">Home</router-link>
      <router-link to="/feed" class="nav-item">Feed</router-link>
      <router-link to="/messages" class="nav-item">Messages</router-link>
      <router-link to="/profile/1" class="nav-item">Profile</router-link>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <!-- Pass songs as prop to routed components -->
      <RouterView :songs="songs" />
    </main>

    <!-- Global Player -->
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
  left: 50px;
  right: 0;
  z-index: 50;
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
  background-color: #111111;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  color: #ffffff;
  text-decoration: solid;
  font-size: 24px;
  transition: all 0.2s ease;
  justify-content: center;
}

/* Page content pushed right */
.main-content {
  margin-left: 140px;
  padding: 20px;
  padding-top: 80px; /* header height */
  padding-bottom: 80px; /* player height */
  height: calc(100vh - 60px - 60px); /* viewport minus header + player */
  overflow-y: auto;
}

/*PlayerBar*/
.player-bar {
  margin-left: 220px; /* same width as sidebar */
  padding: 20px;
}
</style>
