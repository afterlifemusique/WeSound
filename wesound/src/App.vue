<script setup>
import { RouterView } from "vue-router";
import PlayerBar from "./components/PlayerBar.vue";
</script>

<template class="main">
  <div class="app-layout">

    <!-- Navigation -->
    <nav class="sidebar">
      <router-link to="/" class="nav-item">
        <span>Home</span>
      </router-link>

      <router-link to="/feed" class="nav-item">
        <span>Feed</span>
      </router-link>

      <router-link to="/messages" class="nav-item">
        <span>Messages</span>
      </router-link>

      <router-link to="/profile/1" class="nav-item">
        <span>Profile</span>
      </router-link>
    </nav>


    <!-- Global music player -->
    <PlayerBar class="player-bar" />

    <!-- Page content -->
    <main class="main-content">
      <RouterView />
    </main>

  </div>
</template>

<style scoped>
/* Main Page */
.main {
  background-color: #373535;
}
/* Sidebar layout */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
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

/* Page content pushed right */
.main-content {
  margin-left: 220px; /* same width as sidebar */
  padding: 20px;
}

/*PlayerBar*/
.player-bar {
  margin-left: 220px; /* same width as sidebar */
  padding: 20px;
}
</style>
