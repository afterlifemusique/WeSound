<script setup>
defineProps({
  imageUrl: String
});

const emit = defineEmits(['close']);
</script>

<template>
  <Transition name="fade">
    <div v-if="imageUrl" class="lightbox-overlay" @click="emit('close')">
      <button class="lightbox-close" @click="emit('close')">&times;</button>
      <div class="lightbox-content" @click.stop>
        <img :src="imageUrl" class="full-res-image" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  cursor: zoom-out;
  backdrop-filter: blur(8px);
}

.lightbox-content {
  max-width: 90%;
  max-height: 90%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full-res-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  cursor: default;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 30px;
  background: none;
  border: none;
  color: white;
  font-size: 40px;
  font-weight: 200;
  cursor: pointer;
  z-index: 10001;
  transition: opacity 0.2s;
}

.lightbox-close:hover {
  opacity: 0.7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>