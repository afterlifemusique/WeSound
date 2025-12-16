<template>
  <router-link to="/login" class="login-prompt">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="login-icon">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
    <span class="login-label">Sign In</span>
  </router-link>
</template>

<style scoped>
.login-prompt {
  /* Style to match your sidebar */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}
.login-icon {
  width: 24px;
  height: 24px;
}
</style>