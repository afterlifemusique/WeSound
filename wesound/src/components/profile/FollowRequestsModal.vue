<script setup>
defineProps({
  show: Boolean,
  requests: Array,
  processingId: [String, Number]
});

const emit = defineEmits(['close', 'handle-request']);
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Pending Requests</h3>
        <button @click="emit('close')" class="close-btn">&times;</button>
      </div>

      <div class="requests-list">
        <div v-for="req in requests" :key="req.id" class="request-item">
          <div class="req-user">
            <img :src="req.profiles.avatar_url || 'https://via.placeholder.com/40'" class="req-avatar" />
            <div class="req-details">
              <p class="req-name">{{ req.profiles.display_name }}</p>
              <p class="req-username">@{{ req.profiles.username }}</p>
            </div>
          </div>
          <div class="req-buttons">
            <button
                @click="emit('handle-request', req.id, 'accepted')"
                class="accept-btn"
                :disabled="processingId === req.id"
            >
              {{ processingId === req.id ? '...' : 'Accept' }}
            </button>
            <button
                @click="emit('handle-request', req.id, 'declined')"
                class="decline-btn"
                :disabled="processingId === req.id"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #1a1a1a;
  width: 90%;
  max-width: 400px;
  border-radius: 20px;
  border: 1px solid #333;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  line-height: 1;
}

.requests-list {
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  transition: background 0.2s;
}

.request-item:hover {
  background: #222;
}

.req-user {
  display: flex;
  gap: 12px;
  align-items: center;
}

.req-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.req-details {
  display: flex;
  flex-direction: column;
}

.req-name {
  font-weight: 600;
  font-size: 14px;
  margin: 0;
}

.req-username {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.req-buttons {
  display: flex;
  gap: 8px;
}

.accept-btn {
  background: #b8860b;
  color: white;
  border: none;
  padding: 6px 15px;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.accept-btn:hover:not(:disabled) {
  background: #9a7009;
}

.accept-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.decline-btn {
  background: #333;
  color: #ff4d4d;
  border: none;
  padding: 6px 12px;
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.decline-btn:hover:not(:disabled) {
  background: #444;
}

.decline-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>