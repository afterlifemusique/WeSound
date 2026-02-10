<script setup>
defineProps({
  profile: Object,
  stats: Object,
  followStatus: String,
  isOwnProfile: Boolean,
  pendingRequests: Array
});

const emit = defineEmits(['toggle-follow', 'show-requests']);
</script>

<template>
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

        <div
            v-if="isOwnProfile && pendingRequests.length > 0"
            class="stat notification-badge"
            @click="emit('show-requests')"
        >
          <span class="stat-value pulse">{{ pendingRequests.length }}</span>
          <span class="stat-label">Requests</span>
        </div>

        <div class="stat">
          <span class="stat-value">{{ stats.following }}</span>
          <span class="stat-label">Following</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <button
            v-if="!isOwnProfile"
            @click="emit('toggle-follow')"
            :class="['follow-btn', { 'pending-btn': followStatus === 'pending', 'unfollow-btn': followStatus === 'accepted' }]"
        >
          {{ followStatus === 'accepted' ? 'Unfollow' : followStatus === 'pending' ? 'Requested' : 'Follow' }}
        </button>

        <button v-if="isOwnProfile" class="edit-btn">Edit Profile</button>
        <button v-if="!isOwnProfile" class="share-btn">Share</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  align-items: flex-start;
  max-width: 750px;
}

.profile-picture {
  width: 420px;
  height: 420px;
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

.follow-btn.pending-btn {
  background: #333;
  color: #888;
  cursor: default;
}

.follow-btn.unfollow-btn {
  background: transparent;
  border: 1px solid #b8860b;
  color: #b8860b;
}

.follow-btn.unfollow-btn:hover {
  background: rgba(184, 134, 11, 0.1);
}

.notification-badge {
  cursor: pointer;
  color: #b8860b;
}

.pulse {
  background: #b8860b;
  color: white;
  padding: 2px 10px;
  border-radius: 10px;
  animation: shadow-pulse 2s infinite;
}

@keyframes shadow-pulse {
  0% { box-shadow: 0 0 0 0px rgba(184, 134, 11, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(184, 134, 11, 0); }
  100% { box-shadow: 0 0 0 0px rgba(184, 134, 11, 0); }
}
</style>