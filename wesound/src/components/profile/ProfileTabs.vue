<script setup>
defineProps({
  activeTab: String,
  tabs: Array
});

const emit = defineEmits(['update:activeTab']);
</script>

<template>
  <div class="tabs-container">
    <button
        v-for="tab in tabs"
        :key="tab"
        @click="emit('update:activeTab', tab)"
        :class="['tab-button', { active: activeTab === tab }]"
    >
      {{ tab }}
    </button>
  </div>
</template>

<style scoped>
.tabs-container {
  display: flex;
  gap: 0;
  margin-bottom: 40px;
  background: #000;
  border-radius: 50px;
  padding: 8px;
  width: 90%;
  justify-content: space-evenly;
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
</style>