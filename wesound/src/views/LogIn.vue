<template>
  <div class="login-page">
    <div class="login-container">
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Username or Email</label>
          <input
              id="email"
              v-model="email"
              type="text"
              placeholder="Value"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Value"
              required
          />
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <a href="#" class="forgot-password">Forgot password?</a>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>

    <div class="signup-section">
      <span class="signup-text">New to WeSound?</span>
      <button @click="router.push('/signup')" class="signup-btn">Create Account</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signIn } from "../api/auth.js";
import { useUserStore } from "../store/user.js";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const error = ref(null);
const loading = ref(false);

async function login() {
  loading.value = true;
  error.value = null;

  const { data, error: signInError } = await signIn(email.value, password.value);

  if (signInError) {
    error.value = signInError.message;
  } else {
    // User is now logged in, redirect to home
    router.push('/');
  }

  loading.value = false;
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  background: #fff;
}

.form-group input::placeholder {
  color: #999;
}

.form-group input:focus {
  outline: none;
  border-color: #666;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}

.login-btn:hover:not(:disabled) {
  background: #1a1a1a;
}

.login-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.forgot-password {
  font-size: 14px;
  color: #333;
  text-decoration: underline;
  align-self: flex-start;
  margin-top: -8px;
}

.forgot-password:hover {
  color: #000;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin: -8px 0 0 0;
  padding: 12px;
  background: #ffebee;
  border-radius: 6px;
}

.signup-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
}

.signup-text {
  color: #fff;
  font-size: 15px;
}

.signup-btn {
  padding: 10px 24px;
  background: #b8860b;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.signup-btn:hover {
  background: #9a7009;
}
</style>