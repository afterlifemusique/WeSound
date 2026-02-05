<script setup>
import { ref } from 'vue';
import ImageLightbox from './ImageLightbox.vue';

defineProps({
  posts: Array,
  isOwnProfile: Boolean
});

const selectedImage = ref(null);

function openLightbox(url) {
  selectedImage.value = url;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  selectedImage.value = null;
  document.body.style.overflow = 'auto';
}
</script>

<template>
  <div v-if="posts.length" class="posts-grid">
    <div
        v-for="post in posts"
        :key="post.id"
        class="post-card"
        @click="openLightbox(post.image_url)"
    >
      <img :src="post.image_url" class="post-image" />
    </div>

    <ImageLightbox
        :image-url="selectedImage"
        @close="closeLightbox"
    />
  </div>

  <div v-else-if="!isOwnProfile && posts.length === 0" class="private-notice">
    <div class="lock-icon">🔒</div>
    <h3>This profile is private</h3>
    <p>Follow this user to see their photos.</p>
  </div>

  <p v-else class="placeholder-text">No posts yet</p>
</template>

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.post-card {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background: #1a1a1a;
  cursor: pointer;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

.private-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px dashed #444;
}

.lock-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.private-notice h3 {
  margin: 0 0 8px 0;
  color: #fff;
}

.private-notice p {
  color: #888;
  margin: 0;
}

.placeholder-text {
  color: #888;
  font-size: 16px;
  text-align: center;
  padding: 60px 20px;
}
</style>