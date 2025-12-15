<template>
  <div
      @click="goToProfile"
      class="profile-picture-container"
      :aria-label="user?.username ? `Go to ${user.username}'s profile` : 'Go to profile'"
      role="button"
      tabindex="0"
  >
    <img v-if="user && user.avatar_url" :src="user.avatar_url" :alt="user.username" class="profile-avatar" />
    <div v-else class="profile-avatar-placeholder"></div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import {useRouter} from "vue-router";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const router = useRouter();

function goToProfile() {
  // 1. Check if the user object (and the ID) is available
  if (user.value && user.value.id) {
    // 2. Programmatically navigate using router.push
    router.push(`/profile/${user.value.id}`);
  } else {
    // Optional: Handle the case where the user is not loaded or logged in
    // e.g., redirect to login or show a message
    console.warn("User ID not available for navigation.");
  }
}
</script>

<style scoped>
.profile-picture-container {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: #ccc;
}
</style>
