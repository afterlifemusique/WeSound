<script setup>
import { RouterView } from "vue-router";
import PlayerBar from "./components/PlayerBar.vue";
</script>

<template>
  <div class="app-layout">

    <!-- Navigation -->
    <nav class="p-4 flex gap-4 border-b">
      <router-link to="/">Home</router-link>
      <router-link to="/feed">Feed</router-link>
      <router-link to="/messages">Messages</router-link>
      <router-link to="/profile/1">Profile</router-link>
    </nav>

    <!-- Global music player -->
    <PlayerBar />

    <!-- Page content -->
    <main class="p-4">
      <RouterView />
    </main>

  </div>
</template>

<style scoped>
nav a.router-link-active,
nav a.router-link-exact-active {
  font-weight: bold;
}
</style>
