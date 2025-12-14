<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/lib/supabase";

const route = useRoute();
const userId = route.params.id;

const profile = ref(null);
const loading = ref(true);
const activeTab = ref("Music");
const tabs = ["Music", "Posts", "Threads", "Merch", "Events"];

// Stats
const stats = ref({
  followers: 0,
  following: 0,
  totalLikes: 0
});

// Content
const songs = ref([]);
const posts = ref([]);
const threads = ref([]);

const isOwnProfile = computed(() => {
  // TODO: Compare with current user ID
  return false;
});

onMounted(async () => {
  await fetchProfile();
  await fetchStats();
  await fetchContent();
});

async function fetchProfile() {
  loading.value = true;
  const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

  if (data) {
    profile.value = data;
  }
  loading.value = false;
}

async function fetchStats() {
  // Get follower count
  const { count: followerCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

  // Get following count
  const { count: followingCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

  // Get total song likes
  const { count: likesCount } = await supabase
      .from('song_likes')
      .select('song_id', { count: 'exact', head: true })
      .eq('song_id', userId);

  stats.value = {
    followers: followerCount || 0,
    following: followingCount || 0,
    totalLikes: likesCount || 0
  };
}

async function fetchContent() {
  // Fetch songs uploaded by user
  const { data: songsData } = await supabase
      .from('songs')
      .select('*')
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false })
      .limit(12);

  songs.value = songsData || [];

  // Fetch user's threads
  const { data: threadsData } = await supabase
      .from('threads')
      .select('*, profiles!threads_user_id_fkey(*)')
      .eq('user_id', userId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .limit(20);

  threads.value = threadsData || [];
}

async function followUser() {
  // TODO: Implement follow functionality
  console.log('Follow user:', userId);
}

async function unfollowUser() {
  // TODO: Implement unfollow functionality
  console.log('Unfollow user:', userId);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
</script>

<template>
  <div class="profile-page">
    <div v-if="loading" class="loading">
      <p>Loading profile...</p>
    </div>

    <div v-else-if="profile">
      <!-- Profile Header -->
      <div class="profile-header">
        <!-- Profile Picture -->
        <div class="profile-picture">
          <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              :alt="profile.display_name"
              class="avatar-image"
          />
          <div v-else class="avatar-placeholder"></div>
        </div>

        <!-- Profile Info -->
        <div class="profile-info">
          <div class="name-section">
            <h1 class="profile-name">
              {{ profile.display_name || profile.username }}
              <span v-if="profile.is_verified" class="verified-badge">✓</span>
            </h1>
            <p class="username">@{{ profile.username }}</p>
          </div>

          <p v-if="profile.bio" class="bio">{{ profile.bio }}</p>

          <!-- Stats -->
          <div class="stats">
            <div class="stat">
              <span class="stat-value">{{ stats.followers }}</span>
              <span class="stat-label">Followers</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.following }}</span>
              <span class="stat-label">Following</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.totalLikes }}</span>
              <span class="stat-label">Likes</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="actions">
            <button v-if="!isOwnProfile" @click="followUser" class="follow-btn">
              Follow
            </button>
            <button v-if="isOwnProfile" class="edit-btn">
              Edit Profile
            </button>
            <button class="share-btn">Share</button>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-container">
        <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="['tab-button', { active: activeTab === tab }]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Music Tab -->
        <div v-if="activeTab === 'Music'" class="tab-content">
          <div v-if="songs.length" class="songs-grid">
            <div v-for="song in songs" :key="song.id" class="song-card">
              <div class="song-artwork">
                <img
                    v-if="song.artwork_url"
                    :src="song.artwork_url"
                    :alt="song.title"
                />
                <div v-else class="artwork-placeholder">🎵</div>
              </div>
              <div class="song-info">
                <h3 class="song-title">{{ song.title }}</h3>
                <p class="song-artist">{{ song.artist }}</p>
              </div>
            </div>
          </div>
          <p v-else class="placeholder-text">No songs yet</p>
        </div>

        <!-- Posts Tab -->
        <div v-if="activeTab === 'Posts'" class="tab-content">
          <p class="placeholder-text">Posts coming soon</p>
        </div>

        <!-- Threads Tab -->
        <div v-if="activeTab === 'Threads'" class="tab-content">
          <div v-if="threads.length" class="threads-list">
            <div v-for="thread in threads" :key="thread.id" class="thread-card">
              <div class="thread-header">
                <img
                    v-if="thread.profiles?.avatar_url"
                    :src="thread.profiles.avatar_url"
                    class="thread-avatar"
                />
                <div class="thread-user">
                  <span class="thread-username">{{ thread.profiles?.username }}</span>
                  <span class="thread-date">{{ formatDate(thread.created_at) }}</span>
                </div>
              </div>
              <p class="thread-content">{{ thread.content }}</p>
              <div class="thread-stats">
                <span>❤️ {{ thread.like_count }}</span>
                <span>💬 {{ thread.reply_count }}</span>
              </div>
            </div>
          </div>
          <p v-else class="placeholder-text">No threads yet</p>
        </div>

        <!-- Merch Tab -->
        <div v-if="activeTab === 'Merch'" class="tab-content">
          <p class="placeholder-text">Merch coming soon</p>
        </div>

        <!-- Events Tab -->
        <div v-if="activeTab === 'Events'" class="tab-content">
          <p class="placeholder-text">Events coming soon</p>
        </div>
      </div>
    </div>

    <div v-else class="error">
      <p>Profile not found</p>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #2a2a2a;
  color: #fff;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Profile Header */
.profile-header {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  align-items: flex-start;
}

.profile-picture {
  width: 320px;
  height: 320px;
  min-width: 320px;
  border-radius: 40px;
  background: linear-gradient(135deg, #b8860b 0%, #d4a574 100%);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  position: relative;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #b8860b 0%, #d4a574 100%);
  position: relative;
}

.avatar-placeholder::after {
  content: '';
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 70px;
  height: 70px;
  background: #000;
  border-radius: 50%;
  border: 5px solid #b8860b;
}

/* Profile Info */
.profile-info {
  flex: 1;
  padding-top: 20px;
}

.name-section {
  margin-bottom: 16px;
}

.profile-name {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #1d9bf0;
  border-radius: 50%;
  font-size: 16px;
  color: #fff;
}

.username {
  font-size: 18px;
  color: #888;
  margin: 0;
}

.bio {
  font-size: 16px;
  line-height: 1.5;
  margin: 16px 0 24px 0;
  color: #ddd;
}

/* Stats */
.stats {
  display: flex;
  gap: 40px;
  margin-bottom: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  color: #888;
}

/* Actions */
.actions {
  display: flex;
  gap: 12px;
}

.follow-btn,
.edit-btn,
.share-btn {
  padding: 12px 32px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.follow-btn {
  background: #b8860b;
  color: #fff;
}

.follow-btn:hover {
  background: #9a7009;
}

.edit-btn {
  background: #fff;
  color: #000;
}

.edit-btn:hover {
  background: #e0e0e0;
}

.share-btn {
  background: transparent;
  color: #fff;
  border: 1px solid #4a4a4a;
}

.share-btn:hover {
  border-color: #666;
  background: #3a3a3a;
}

/* Navigation Tabs */
.tabs-container {
  display: flex;
  gap: 0;
  margin-bottom: 40px;
  background: #000;
  border-radius: 50px;
  padding: 8px;
  max-width: fit-content;
}

.tab-button {
  padding: 14px 40px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s;
  white-space: nowrap;
}

.tab-button:hover {
  background: #1a1a1a;
}

.tab-button.active {
  background: #fff;
  color: #000;
}

/* Content Area */
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

/* Songs Grid */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.song-card {
  background: #3a3a3a;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.song-card:hover {
  transform: translateY(-4px);
}

.song-artwork {
  width: 100%;
  aspect-ratio: 1;
  background: #4a4a4a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.song-artwork img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artwork-placeholder {
  font-size: 48px;
}

.song-info {
  padding: 12px;
}

.song-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 13px;
  color: #888;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Threads List */
.threads-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
}

.thread-card {
  background: #3a3a3a;
  border-radius: 12px;
  padding: 20px;
}

.thread-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.thread-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.thread-user {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.thread-username {
  font-weight: 600;
  font-size: 14px;
}

.thread-date {
  font-size: 12px;
  color: #888;
}

.thread-content {
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.thread-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #888;
}

/* Loading & Error */
.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
  }

  .profile-picture {
    width: 280px;
    height: 280px;
    min-width: 280px;
  }

  .profile-info {
    text-align: center;
    width: 100%;
  }

  .stats {
    justify-content: center;
  }

  .actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .tabs-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab-button {
    padding: 12px 24px;
    font-size: 14px;
  }

  .songs-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>