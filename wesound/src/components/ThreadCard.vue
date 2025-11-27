<template>
  <div class="border-b p-4">
    <div class="flex items-center gap-2">
      <img :src="thread.users.avatar_url" class="w-8 h-8 rounded-full" />
      <strong>{{ thread.users.username }}</strong>
    </div>
    <p class="mt-2">{{ thread.content }}</p>
  </div>
</template>

<script setup>
defineProps({ thread: Object });
</script>
