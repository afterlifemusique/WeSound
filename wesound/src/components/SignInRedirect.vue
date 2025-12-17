<template>
  <router-link to="/signin" class="signin-prompt">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="signin-icon">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
    <span class="signin-label">Sign In</span>
  </router-link>
</template>

<style scoped>
.signin-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  transition: opacity 0.2s;
}

.signin-prompt:hover {
  opacity: 0.8;
}

.signin-icon {
  width: 24px;
  height: 24px;
}

.signin-label {
  font-weight: 500;
}
</style>