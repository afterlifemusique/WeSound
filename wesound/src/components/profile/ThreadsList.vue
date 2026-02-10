<script setup>
import { formatDate } from '@/utils/formatters';

defineProps({
  threads: Array
});
</script>

<template>
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
</template>

<style scoped>
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

.placeholder-text {
  color: #888;
  font-size: 16px;
  text-align: center;
  padding: 60px 20px;
}
</style>