<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
import { usePlayer } from '@/store/player'
import { supabase } from '@/lib/supabase';

// Composables
import { useProfile } from '@/composables/useProfile';
import { useProfileContent } from '@/composables/useProfileContent';
import { useFollowRequests } from '@/composables/useFollowRequests';
import { useImageUpload } from '@/composables/useImageUpload';
import { useMusicUpload } from '@/composables/useMusicUpload';

// Components
import ProfileHeader from '@/components/profile/ProfileHeader.vue';
import ProfileTabs from '@/components/profile/ProfileTabs.vue';
import MusicGrid from '@/components/profile/MusicGrid.vue';
import PostsGrid from '@/components/profile/PostsGrid.vue';
import ThreadsList from '@/components/profile/ThreadsList.vue';
import FollowRequestsModal from '@/components/profile/FollowRequestsModal.vue';

const route = useRoute();
const player = usePlayer();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// State
const activeTab = ref("Music");
const tabs = ["Music", "Posts", "Threads", "Merch", "Events"];
const showRequestsModal = ref(false);

// Composables
const {
  profile,
  loading,
  stats,
  followStatus,
  isOwnProfile,
  fetchProfile,
  fetchStats,
  toggleFollow
} = useProfile(route.params.id, user);

const {
  songs,
  posts,
  threads,
  fetchContent
} = useProfileContent(user, isOwnProfile);

const {
  pendingRequests,
  processingId,
  fetchPendingRequests,
  handleRequest
} = useFollowRequests(user);

const {
  uploading,
  deleting,
  handleFileUpload,
  handleDeletePost
} = useImageUpload(user);

const {
  uploading: uploadingMusic,
  deletingId: deletingMusicId,
  handleMusicUpload,
  handleDeleteSong
} = useMusicUpload(user);

// Load profile data
async function loadProfileData(id) {
  if (!id) return;
  loading.value = true;

  try {
    await Promise.allSettled([
      fetchProfile(id),
      fetchStats(id),
      fetchContent(id)
    ]);
  } catch (error) {
    console.error("Critical load error:", error);
  } finally {
    loading.value = false;
  }
}

// Watch route changes
watch(
    () => route.params.id,
    async (newId) => {
      if (newId) {
        await loadProfileData(newId);
      }
    },
    { immediate: true }
);

// Watch for own profile to load requests
watch(isOwnProfile, (newVal) => {
  if (newVal) fetchPendingRequests();
}, { immediate: true });

// Handlers
// Play profile songs
function handlePlaySong(song) {
  // Set the entire songs array as playlist
  player.setPlaylist(songs.value);
  // Play the clicked song
  player.play(song);
}

async function handleToggleFollow() {
  await toggleFollow(profile.value.id);
}

async function handleUploadFile(file) {
  await handleFileUpload(file, () => {
    fetchContent(user.value.id);
  });
}

async function handleFollowRequest(requestId, status) {
  await handleRequest(requestId, status, () => {
    if (profile.value) {
      fetchStats(profile.value.id);
    }
  });
}

async function handlePostDelete(postId) {
  await handleDeletePost(postId, () => {
    fetchContent(user.value.id);
  });
}

async function handleUploadMusic(file) {
  await handleMusicUpload(file, () => {
    fetchContent(user.value.id);
  });
}

// Track if we're currently deleting to prevent double calls
const isDeletingSong = ref(false);

async function onSongDelete(songId) {
  if (isDeletingSong.value) {
    console.log('Already deleting, skipping');
    return;
  }

  console.log('ProfilePage: onSongDelete called with songId:', songId);
  isDeletingSong.value = true;

  // Optimistically remove from UI first
  songs.value = songs.value.filter(song => song.id !== songId);

  // Call the composable's delete function
  await handleDeleteSong(songId, async () => {
    console.log('ProfilePage: Delete successful');
    // Re-fetch to ensure sync with database
    const { data: songsData } = await supabase
        .from('songs')
        .select('*')
        .eq('uploaded_by', user.value.id)
        .order('created_at', { ascending: false });

    songs.value = songsData || [];
    console.log('ProfilePage: Songs refreshed, count:', songs.value.length);
  });

  isDeletingSong.value = false;
}
</script>

<template>
  <div class="profile-page">
    <div v-if="loading" class="loading">
      <p>Loading profile...</p>
    </div>

    <div v-else-if="profile" class="profile">
      <div class="left-side">
        <ProfileHeader
            :profile="profile"
            :stats="stats"
            :follow-status="followStatus"
            :is-own-profile="isOwnProfile"
            :pending-requests="pendingRequests"
            @toggle-follow="handleToggleFollow"
            @show-requests="showRequestsModal = true"
        />
      </div>

      <div class="right-side">
        <ProfileTabs
            :active-tab="activeTab"
            :tabs="tabs"
            @update:active-tab="activeTab = $event"
        />

        <div class="content-area">
          <div v-if="activeTab === 'Music'" class="tab-content">
            <MusicGrid
                :songs="songs"
                :is-own-profile="isOwnProfile"
                :uploading="uploadingMusic"
                :deleting-id="deletingMusicId"
                @upload-song="handleUploadMusic"
                @delete-song="onSongDelete"
                @play-song="handlePlaySong"
            />
          </div>

          <div v-if="activeTab === 'Posts'" class="tab-content">
            <PostsGrid
                :posts="posts"
                :is-own-profile="isOwnProfile"
                :uploading="uploading"
                @upload-file="handleUploadFile"
                @delete-post="handlePostDelete"
            />
          </div>

          <div v-if="activeTab === 'Threads'" class="tab-content">
            <ThreadsList :threads="threads" />
          </div>

          <div v-if="activeTab === 'Merch'" class="tab-content">
            <p class="placeholder-text">Merch coming soon</p>
          </div>

          <div v-if="activeTab === 'Events'" class="tab-content">
            <p class="placeholder-text">Events coming soon</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error">
      <p>Profile not found</p>
    </div>

    <FollowRequestsModal
        :show="showRequestsModal"
        :requests="pendingRequests"
        :processing-id="processingId"
        @close="showRequestsModal = false"
        @handle-request="handleFollowRequest"
    />
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: transparent;
  color: #fff;
  padding: 0;
  max-width: 1900px;
  margin: 0;
  display: flex;
  flex-direction: row;
}

.profile {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.left-side {
  display: flex;
  flex-direction: column;
  width: 40%;
}

.right-side {
  display: flex;
  flex-direction: column;
  width: 60%;
}

.content-area {
  min-height: 400px;
}

.tab-content {
  padding: 20px 0;
}

.placeholder-text {
  color: #888;
  font-size: 16px;
  text-align: center;
  padding: 60px 20px;
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

@media (max-width: 1024px) {
  .profile {
    flex-direction: column;
  }

  .left-side,
  .right-side {
    width: 100%;
  }
}
</style>