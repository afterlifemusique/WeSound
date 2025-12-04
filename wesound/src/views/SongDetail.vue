<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useITunesSong } from "../composables/useITunesSong";
import { usePlayer } from "../store/player";
import PlayerBar_SongDetail from "../components/PlayerBar_SongDetail.vue";

const route = useRoute();
const id = route.params.id;

const { song, loading, error, fetchSong } = useITunesSong();
const player = usePlayer();

onMounted(() => {
  fetchSong(id);
});
</script>

<template>
  <div v-if="loading">
    <h1>Loading...</h1>
  </div>

  <div v-else-if="error">
    <h1>{{ error }}</h1>
  </div>

  <div v-else-if="song" class="main-container">
    <div class="content-wrapper">
      <div class="left-side">
        <img :src="song.artwork" class="cover" />
        <PlayerBar_SongDetail />
        <div class="info">
          <h1>{{ song.title }}</h1>
          <h2>{{ song.artist }}</h2>
          <p>{{ song.album }}</p>
        </div>
        <button class="like-btn" @click="player.like(song)">Like</button>
      </div>
      <div class="right-side">
        <div class="rs-navbar">
          <router-link
              :to="`/song/${id}/comments`"
              class="nav-item"
          >
            Comments
          </router-link>

          <router-link
              :to="`/song/${id}/covers`"
              class="nav-item"
          >
            Covers
          </router-link>

          <router-link
              :to="`/song/${id}/remixes`"
              class="nav-item"
          >
            Remixes
          </router-link>
        </div>

        <div class="rs-content"></div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.main-container {
  min-height: 100vh;
  width: 100%;
}

/* NEW: This is the horizontal container */
.content-wrapper {
  display: flex;
  width: 100%;
}

.left-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 50%;
}

.cover {
  width: 100%;
  max-width: 750px;
  border-radius: 12px;
}

.like-btn {
  padding: 12px 20px;
  background: #8f6c28;
  border: none;
  color: black;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

/* Right column */
.right-side {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rs-navbar{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.nav-item {
  padding: 12px 20px;
  background: gainsboro;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  text-decoration: none;
  color: black;
  font-weight: 600;
  transition: 0.2s ease;
}

.nav-item:hover {
  background: #272727;
  color: white;
  transform: translateY(-2px);
}

</style>
