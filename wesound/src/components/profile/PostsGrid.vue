<script setup>
import { ref } from 'vue';
import ImageLightbox from './ImageLightbox.vue';

const props = defineProps({
  posts: Array,
  isOwnProfile: Boolean,
  uploading: Boolean
});

const emit = defineEmits(['upload-file', 'delete-post']);

const selectedImage = ref(null);
const fileInput = ref(null);
const deletingId = ref(null);

function openLightbox(url) {
  selectedImage.value = url;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  selectedImage.value = null;
  document.body.style.overflow = 'auto';
}

function handleFileChange(event) {
  emit('upload-file', event.target.files[0]);
}

async function handleDelete(event, postId) {
  event.stopPropagation(); // Prevent opening lightbox

  if (!confirm('Delete this post?')) return;

  deletingId.value = postId;
  emit('delete-post', postId);
  // deletingId will be reset by parent after deletion
}
</script>

<template>
  <div>
    <!-- Upload Button for Own Profile -->
    <div v-if="isOwnProfile" class="upload-section">
      <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none" />
      <button @click="fileInput.click()" class="upload-btn" :disabled="uploading">
        {{ uploading ? 'Uploading...' : '📷 Post Photo' }}
      </button>
    </div>

    <div v-if="posts.length" class="posts-grid">
      <div
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          @click="openLightbox(post.image_url)"
      >
        <img :src="post.image_url" class="post-image" />

        <!-- Delete Button (only for own profile) -->
        <button
            v-if="isOwnProfile"
            @click="handleDelete($event, post.id)"
            class="delete-btn"
            :disabled="deletingId === post.id"
            :title="deletingId === post.id ? 'Deleting...' : 'Delete post'"
        >
          <span v-if="deletingId === post.id">⏳</span>
          <span v-else>🗑️</span>
        </button>
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
  </div>
</template>

<style scoped>
.upload-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.upload-btn {
  padding: 12px 32px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: #b8860b;
  color: #fff;
}

.upload-btn:hover:not(:disabled) {
  background: #9a7009;
}

.upload-btn:disabled {
  background: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

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

/* Delete Button */
.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
}

.post-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.delete-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.delete-btn:active:not(:disabled) {
  transform: scale(0.95);
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