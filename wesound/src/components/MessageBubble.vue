<template>
  <div :class="['message', isOwn ? 'own' : '']">
    <p>{{ message.content }}</p>
    <small>{{ message.created_at }}</small>
  </div>
</template>

<script setup>
const props = defineProps({
  message: Object,
  isOwn: Boolean
});
</script>

<style scoped>
.message {
  padding: 8px;
  border-radius: 8px;
  background: #eee;
  max-width: 70%;
  margin-bottom: 8px;
}
.message.own {
  background: #a0d911;
  margin-left: auto;
}
</style>
