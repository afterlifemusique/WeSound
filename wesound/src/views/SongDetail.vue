<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useITunesSong } from "../composables/useITunesSong";
import { usePlayer } from "../store/player";
import PlayerBar_SongDetail from "../components/PlayerBar_SongDetail.vue";
import Queue from "@/components/Queue.vue";

const route = useRoute();

const { song, loading, error, fetchSong } = useITunesSong();

onMounted(() => {
  fetchSong(route.params.id);
});

watch(
    () => route.params.id,
    (newId) => {
      fetchSong(newId);   // reload correct song
    }
);

watch(song, (s) => {
  if (!s) return;

  const player = usePlayer();

  // only reload if the track changed
  if (player.track?.id !== s.id) {

    // update playlist + index
    const i = player.playlist.findIndex(t => t.id === s.id);
    if (i !== -1) {
      player.currentIndex = i;
    } else {
      player.playlist.push(s);
      player.currentIndex = player.playlist.length - 1;
    }

    player.track = s;
    player._loadTrack(s);
    player.play(); // autoplay NEW songs only
  }

  // If same song → DO NOTHING
});

const activeTab = ref(null);

function setActiveTab(tabName) {
  activeTab.value = tabName;
}

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
      </div>
      <div class="right-side">
        <div class="rs-navbar">
          <button
              class="nav-item"
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
          <router-link
              :to="`/song/${route.params.id}/comments`"
              class="nav-item"
              active-class="active"
          >
            Comments
          </router-link>

          <router-link
              :to="`/song/${route.params.id}/covers`"
              class="nav-item"
              active-class="active"
          >
            Covers
          </router-link>

          <router-link
              :to="`/song/${route.params.id}/remixes`"
              class="nav-item"
              active-class="active"
          >
            Remixes
          </router-link>
        </div>

        <div class="rs-content">
          <div v-if="activeTab === 'queue'">
            <keep-alive>
              <Queue />
            </keep-alive>
          </div>
          <div v-else>
            <p>Select a tab to see content.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.main-container {
  height: 10vh;
  width: 100%;
}

.content-wrapper {
  display: flex;
  width: 100%;
  min-height: 0;       /* required for nested scrolling */
}

.left-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 45%;
}

.cover {
  width: 100%;
  max-width: 900px;
  border-radius: 12px;
}

/* Right column */
.right-side {
  position: fixed;
  width: 48%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;           /* allow children to shrink so scroll works */
  right: 0;
  top: 16px;
  margin-right: 30px;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-decoration: none;
  color: black;
  font-weight: 600;
  transition: 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
}

.nav-item:hover,
.nav-item.active {
  background: #272727;
  color: white;
  transform: translateY(-2px);
}

.rs-content {
  flex: 1;
  max-height: 1000px;
  overflow-y: hidden;       /* prevent double scrolling */
}

</style>
